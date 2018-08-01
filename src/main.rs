extern crate data;
extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate web_view;
extern crate plist;

use web_view::*;
use data::{
    Party,
    User,
};

static INDEX: &'static str = include_str!("assets/index.html");

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
struct State {
    pub parties: Vec<Party>,
    pub users: Vec<User>,
    pub css_hex: String,
}
#[derive(Deserialize)]
#[serde(rename_all = "PascalCase")]
struct AppleSettings {
    pub apple_highlight_color: String
}

impl AppleSettings {
    pub fn css_hex(&self) -> String {
        let mut parts = self.apple_highlight_color.split(" ");
        let r = parts.next().expect("Unable to get r str");
        let g = parts.next().expect("Unable to get g str");
        let b = parts.next().expect("Unable to get b str");
        let r: f32 = r.parse().expect("Unable to parse r str");
        let g: f32 = g.parse().expect("Unable to parse g str");
        let b: f32 = b.parse().expect("Unable to parse b str");
        let r = (r * 255.0) as usize;
        let g = (g * 255.0) as usize;
        let b = (b * 255.0) as usize;
        format!("#{:02x}{:02x}{:02x}", r, g, b)
    }
}

fn main() {
    let prefs = ::std::fs::File::open("/Users/RFM/Library/Preferences/.GlobalPreferences.plist").expect("Unable to read global preferences");
    let settings: AppleSettings = plist::serde::deserialize(prefs).expect("Unable to serialize plist");
    let size = (800, 600);
    let parties = if let Some(parties) = data::get_all_parties() {
        parties
    } else {
        ::std::process::exit(1);
    };
    let users = if let Some(users) = data::get_all_users() {
        users
    } else {
        ::std::process::exit(1);
    };
    run(
        "Mashton.party Updater",
        Content::Html(INDEX),
        Some(size),
        true,
        true,
        init,
        event_loop,
        State {
            parties,
            users,
            css_hex: settings.css_hex()
        }
    );
}

fn init(mu: MyUnique<WebView<State>>) {
    println!("init");
}


fn event_loop(wv: &mut WebView<State>, arg: &str, state: &mut State) {
    println!("event_loop {:?}", arg);
    match serde_json::from_str(arg) {
            Ok(msg) =>  {
            match msg {
                InboundMessage::Loaded => {
                    println!("loaded");
                    inject_app(wv, state);
                    return;
                },
                InboundMessage::Ready => {
                    println!("react app ready");
                },
                InboundMessage::NewParty(p) => {
                    if let None = data::add_party(p) {
                        inject_event(wv, OutboundMessage::Error("Unable to add party".into()));
                        return;
                    }
                },
                InboundMessage::UpdatedParty(p) => {
                    if let None = data::update_party(p) {
                        inject_event(wv, OutboundMessage::Error("Unable to update party".into()));
                        return;
                    }
                },
                InboundMessage::RemoveParty(id) => {
                    println!("RemoveParty {}", id);
                },
                InboundMessage::NewUser(u) => {
                    println!("NewUser {}", u.name);
                },
                InboundMessage::UpdateUser(u) => {
                    println!("UpdateUser {}", u.name);
                },
                InboundMessage::RemoveUser(id) => {
                    println!("RemoveUser {}", id);
                },
                InboundMessage::SetTitle(title) => {
                    wv.set_title(&title);
                    return;
                }
            }
            if let Some(parties) = data::get_all_parties() {
                state.parties = parties;
            }
            if let Some(users) = data::get_all_users() {
                state.users = users;
            }
            inject_event(wv, OutboundMessage::new_state(state.clone()));
        },
        Err(e) => {
            println!("Error parsing arg {}\n{:?}", arg, e);
            inject_event(wv, OutboundMessage::error(&format!("Error parsing arg {}", arg), e));
        }
    }
}

fn inject_app(wv: &mut WebView<State>, _: &mut State) {
    wv.inject_css(&get_css());
    wv.eval(&get_js());
}

fn inject_event(wv: &mut WebView<State>, ev: OutboundMessage) {
    let js = dispatch_event(ev);
    wv.eval(&js);
}

fn dispatch_event(ev: OutboundMessage) -> String {
    format!("window.dispatchEvent({})", ev.to_string())
}

fn get_css() -> String {
    ::std::fs::read_to_string("src/assets/main.css").expect("Failed to read css file")
}

fn get_js() -> String {
    ::std::fs::read_to_string("src/assets/app.js").expect("Failed to read js file")
}


#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "kind", content = "data")]
enum InboundMessage {
    /// HTML Loaded
    Loaded,
    /// React App Ready
    Ready,
    NewParty(Party),
    UpdatedParty(Party),
    RemoveParty(i32),
    NewUser(User),
    UpdateUser(User),
    RemoveUser(i32),
    SetTitle(String),
}

#[derive(Debug)]
enum OutboundMessage {
    NewState(State),
    Error(String),
}

impl OutboundMessage {
    pub fn error(msg: &str, e: impl ::std::error::Error) -> OutboundMessage {
        OutboundMessage::Error(format!("{}\n{:?}", msg, e))
    }
    pub fn new_state(state: State) -> Self {
        OutboundMessage::NewState(state)
    }
}

impl ToString for OutboundMessage {
    fn to_string(&self) -> String {
        match self {
            &OutboundMessage::NewState(ref s) => {
                match serde_json::to_string(s) {
                    Ok(state_str) => custom_event("new-state", &state_str),
                    Err(e) => OutboundMessage::error("Error serializing state", e).to_string()
                }
            },
            &OutboundMessage::Error(ref msg) => {
                custom_event("app-error", msg)
            },
        }
    }
}

fn custom_event(name: &str, detail: &str) -> String {
    let ret = format!("new CustomEvent( '{}', {{ detail: {} }})", name, detail);
    ret
}