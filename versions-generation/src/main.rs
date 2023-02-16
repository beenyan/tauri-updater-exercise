use reqwest::{self, header};
use serde::Deserialize;
use std::env;

#[derive(Deserialize, Debug)]
struct ReleasesAssets {
    name: String,
    browser_download_url: String,
}

#[derive(Deserialize, Debug)]
struct ReleasesData {
    tag_name: String,
    name: String,
    draft: bool,
    prerelease: bool,
    published_at: String,
    assets: Vec<ReleasesAssets>,
}

impl ReleasesData {
    fn available(&self) -> bool {
        !self.draft && !self.prerelease && self.assets.len() != 0
    }

    
}

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    let owner = env::var("OWNER").expect("OWNER variavles is must");
    let repo = env::var("REPO").expect("REPO variavles is must");
    let notes = env::var("NOTES");
    let cargo_version = env::var("CARGO_PKG_VERSION").unwrap();
    let user_agent = format!("RustRuntime/{cargo_version}");
    let url = format!("https://api.github.com/repos/{owner}/{repo}/releases");
    let mut headers = header::HeaderMap::new();
    headers.insert(
        "User-Agent",
        header::HeaderValue::from_str(&user_agent).unwrap(),
    );

    let client = reqwest::Client::builder()
        .default_headers(headers)
        .build()
        .unwrap();
    let res = client
        .get(url)
        .send()
        .await
        .unwrap()
        .json::<Vec<ReleasesData>>()
        .await
        .unwrap();

    let releases_latest = &res
        .into_iter()
        .filter(|r| r.available())
        .collect::<Vec<ReleasesData>>()[0];
    println!("res: {:#?}", releases_latest);
}
