import Message from '../model/message';
import RustState from '../index';
import Party from '../../../../mashton.party/app/models/party';
import User from '../../../../mashton.party/app/models/user';
export default class Data {
    private listener?: (state: RustState) => void;
    private errorHandler?: (msg: String) => void;
    constructor(
    ) {
        console.log('new Data');
        window.addEventListener('new-state', (ev: CustomEvent) => this.stateChange(ev.detail));
        window.addEventListener('app-error', (ev: CustomEvent) => this.error(ev.detail));
    }

    public registerListener(listener: (state: RustState) => void) {
        console.log('Data.registerListener');
        this.listener = listener;
        this.send(Message.Ready())
    }

    public registerErrorHandler(handler: (msg: string) => void) {
        this.errorHandler = handler;
    }

    public setTitle(newTitle: string) {
        this.send(Message.SetTitle(newTitle))
    }

    private stateChange(detail: RustState) {
        console.log('Data.stateChange');
        detail.parties = detail.parties.map(Party.fromJson);
        detail.users = detail.users.map(User.fromJson);
        if (this.listener) {
            this.listener(detail);
        } else {
            console.log('no listener for state change', detail);
        }
    }

    private error(msg: string) {
        console.error('Data.error', msg);
        if (this.errorHandler) {
            this.errorHandler(msg);
        } else {
            console.error('no listener for error', msg);
        }
    }

    private send(msg: Message) {
        try {
            (window.external as any).invoke(JSON.stringify(msg));
        } catch (e) {
            this.error(e.message);
        }
    }
}