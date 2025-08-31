fn main() {
    // this is not what I expected
    /* let available_versions = ["v2_5", "v2_0"];

    for version in available_versions{
        println!("cargo:rustc-cfg={version}");
        println!("cargo:rustc-check-cfg=cfg({version})");
    } */

   // I would need to get the flags, then parse, then make some custom flaging
   // for example making some flag that means that it can be X and Y but also it actually doesn't behave exactly how you want it to behave
   // because if you don't put the thing, it will then be confused, buf it you put the thing, you must indicate that it's false
   // ...hell
}