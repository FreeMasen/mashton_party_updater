import * as React from 'react';
import User from '../../../mashton.party/app/models/user';
import Party from '../../../mashton.party/app/models/party';
import {
    ListView,
    ListViewSection,
    ListViewSectionHeader,
    ListViewRow,
    Text, Label
} from 'react-desktop/macOs';
import OSXInput from './osxInput';
interface GuestFormProps {
    guest?: User;
    highlightColor: string;
    parties: Array<Party>;
}
interface GuestFormState {
    guest: User
}

export default class GuestForm extends React.Component<GuestFormProps, GuestFormState> {
    constructor(props) {
        super(props);
        this.state = {
            guest: props.guest || new User(-1, '', '', [], ''),
        }
    }
    render() {
        return (
            <ListView>
            <ListViewSection>
                <ListViewRow>
                    <Label>Name</Label>
                    <OSXInput
                        initialValue={this.state.guest.name}
                        onChange={(v: string) => console.log('update guest name')}
                        highlightColor={this.props.highlightColor}
                    />
                </ListViewRow>
                <ListViewRow>
                    <Label>Email</Label>
                    <OSXInput
                        initialValue={this.state.guest.email}
                        onChange={(v: number) => console.log('update email', v)}
                        highlightColor={this.props.highlightColor}
                    />
                </ListViewRow>
                <ListViewRow>
                    <Label>Email</Label>
                    <OSXInput
                        initialValue={this.state.guest.email}
                        onChange={(v: number) => console.log('update email', v)}
                        highlightColor={this.props.highlightColor}
                    />
                </ListViewRow>
                </ListViewSection>
                <ListViewSection>
                    <ListViewSectionHeader>
                        <Text>Invitations</Text>
                    </ListViewSectionHeader>
                    {
                        this.state.guest.invitedTo.map(i => {
                            let party = this.props.parties.find(p => p.id == i);
                            if (!party) return null;
                            return this.partyRow(party);
                        })
                    }
                </ListViewSection>
            </ListView>
        )
    }
    partyRow(p: Party) {
        return (
            <ListViewRow
                key={`invite-row-${p.id}`}
            >
            <div
                style={{
                    display: 'flex',
                    flexFlow: 'row',
                    background: this.props.highlightColor,
                    padding: 5,
                }}
            >
                <Text>{p.name}</Text>
                <Text
                style={{
                    marginLeft: 5
                }}>{p.date.format('M/D/YY')}</Text>
            </div>
            </ListViewRow>
        );
    }
}