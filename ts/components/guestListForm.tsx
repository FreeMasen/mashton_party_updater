import * as React from 'react';
import User from '../../../../mashton.party/app/models/user';
interface GuestListFormProps {
    allGuests: Array<User>;
    invited: Array<User>
}
interface GuestListFormState {
    invited: Array<User>;
}

export default class GuestListForm extends React.Component<GuestListFormProps, GuestListFormState> {
    constructor(props: GuestListFormProps) {
        super(props);
        this.state = {
            invited: props.invited,
        }
    }
    render() {
        return (
            <div>
            </div>
        )
    }
}
