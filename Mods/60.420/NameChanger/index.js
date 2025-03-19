const base = Process.findModuleByName("libg.so").base;
const nameFunc = base.add(0x34C250);
const customName = "CustomName!!!";
const nameBuf = Memory.allocUtf8String(customName);
Interceptor.replace(nameFunc, new NativeCallback(function(arg0) {
    return nameBuf;
}, 'pointer', ['pointer']));
