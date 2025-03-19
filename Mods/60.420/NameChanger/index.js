const base = Module.getBaseAddress("libg.so");
const modsFolder = "/data/local/tmp/mods";
let newStrings = JSON.parse(readFile(`${modsFolder}/NameChanger/strings.json`, "r"));
const newNamePtr = Memory.allocUtf8String(newStrings.name);
Interceptor.replace(base.add(0x8F8B08), new NativeCallback(function() {
    return newNamePtr;
}, 'pointer', []));
