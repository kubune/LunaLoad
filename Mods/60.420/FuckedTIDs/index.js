const base = Module.getBaseAddress('libg.so');

let speed = 60; // Adjust to your needs

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

let newStrings = FormatJSONString(readFile(`${modsFolder}/FuckedTIDs/strings.json`, "r"));

let pool, counter = 0;
const newPool = function() { pool = Math.floor(Math.random(0, newStrings.length)*newStrings.length) }
newPool();
Interceptor.attach(StringTable_getString, {
    onLeave(retval) {
        try {
            this.c = 0;
            this.c % 30 == 0 ? retval.replace(Utils.createStringObject(newStrings[pool])) : null;
            this.c++;
        } catch (e) {}
    }
});
Interceptor.attach(base.add(0x3BF00C), { // GameMain::update
    onEnter(args) {
        counter++ 
        if (counter % speed == 0) { newPool(); }
    }
});