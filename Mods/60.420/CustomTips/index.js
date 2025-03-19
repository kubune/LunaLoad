const base = Module.getBaseAddress('libg.so');

let tips = 67;

const malloc = new NativeFunction(Module.getExportByName('libc.so', 'malloc'), 'pointer', ['uint']);
const StringCtor = new NativeFunction(base.add(0xB32AFC), 'pointer', ['pointer', 'pointer']);
const StringTable_getString = new NativeFunction(base.add(0x79823C), 'pointer', ['pointer']);

const Utils = {
    StringCtor(ptr, strptr) {
        StringCtor(ptr, strptr);
    },
    createStringPtr(str) {
        var ptr = malloc(str.length + 1);
        Memory.writeUtf8String(ptr, str);
        return ptr;
    },
    createStringObject(str) {
        var strptr = Utils.createStringPtr(str);
        let ptr = malloc(128);
        Utils.StringCtor(ptr, strptr);
        return ptr;
    }
}
function isNumeric(n) { return !isNaN(parseFloat(n)) && isFinite(n); }
let newStrings = JSON.parse(readFile(`${modsFolder}/CustomTips/strings.json`, "r"));

Interceptor.attach(StringTable_getString, {
    onEnter(args) {
        this.value = Memory.readUtf8String(args[0]);
    },
    onLeave(retval) {
        try {
            if (this.value.startsWith("TID_HINT_")) {
                if (isNumeric(this.value.split("_")[2])) {
                    retval.replace(Utils.createStringObject(newStrings[Math.floor(Math.random(0, newStrings.length)*newStrings.length)]));
                }
            }
        } catch (e) {}
    }
});