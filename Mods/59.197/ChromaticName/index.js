Interceptor.replace(new NativeFunction(Module.getBaseAddress('libg.so').add(0x8B3C30), 'int', ['pointer']), new NativeCallback(function() {return 1}, 'int', []));
