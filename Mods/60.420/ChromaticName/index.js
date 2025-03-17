const base = Module.getBaseAddress("libg.so");
Interceptor.replace(base.add(0x8F8B08), new NativeCallback(function() {
    return 1;
}, 'int', []));