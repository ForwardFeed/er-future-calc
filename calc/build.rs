fn main() {

    let available_versions = ["v2_5"];

    for version in available_versions{
        println!("cargo:rustc-cfg={version}");
        println!("cargo:rustc-check-cfg=cfg({version})");
    }
}