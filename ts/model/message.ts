import Party from '../../../../mashton.party/app/models/party';
import User from '../../../../mashton.party/app/models/user';
type MessageData = number | Party | User | string;
export default class Message {
    constructor(
        public kind: MessageKind,
        public data?: MessageData,
    ) { }
    static Ready(): Message {
        return new Message(
            MessageKind.Ready,
        )
    }
    static SetTitle(newTitle: string): Message {
        return new Message (
            MessageKind.SetTitle,
            newTitle,
        )
    }
}

enum MessageKind {
    Loaded = 'Loaded',
    Ready = 'Ready',
    NewParty = 'NewParty',
    UpdatedParty = 'UpdatedParty',
    RemoveParty = 'RemoveParty',
    NewUser = 'NewUser',
    UpdateUser = 'UpdateUser',
    RemoveUse = 'RemoveUse',
    SetTitle = 'SetTitle',
}