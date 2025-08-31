fn main() {
    println!("cargo::rustc-cfg=my_custom_flag_v2");
    println!("cargo:rustc-check-cfg=my_custom_flag_v2");
}