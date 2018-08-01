import * as React from 'react';
import * as moment from 'moment';
import Party from '../../../../mashton.party/app/models/party';
import Place from '../../../../mashton.party/app/models/place';
import {
    ListView,
    ListViewSection,
    ListViewSectionHeader,
    ListViewRow,
    ListViewHeader,
    ListViewSeparator,
    Text, Label
} from 'react-desktop/macOs';
import OSXInput from './osxInput';
interface partyFormProps {
    party?: Party;
    highlightColor: string;
}
interface partyFormState {
    party: Party;
}

export default class PartyForm extends React.Component<partyFormProps, partyFormState> {
    constructor(props) {
        super(props);
        this.state = {
            party: props.party || new Party(),

        }
    }
    render() {
        let hour = this.props.party.date.hour();
        let isAm = true;
        if (hour > 12) {
            hour = hour - 12;
            isAm = false;
        }
        return (
            <ListView>
                <ListViewHeader>
                    <Label>Party Name</Label>
                    <OSXInput
                        initialValue={this.state.party.name}
                        onChange={(v: string) => this.updatePartyName(v)}
                        highlightColor={this.props.highlightColor}

                    />
                </ListViewHeader>
                <ListViewSection>
                    <ListViewSectionHeader>
                        <Text>When</Text>
                    </ListViewSectionHeader>
                    <ListViewRow>
                        <div>
                            <Label>Date</Label>
                            <div
                                style={{
                                    display: 'flex',
                                    flexFlow: 'row',
                                }}
                            >
                                <OSXInput
                                    initialValue={this.state.party.date.month() + 1}
                                    onChange={(v: number) => this.updatePartyDate('month', v)}
                                    highlightColor={this.props.highlightColor}
                                    outerStyle={{
                                        width: 50,
                                        marginLeft: 10,
                                    }}
                                    inputStyle={{
                                        width: 50,
                                    }}
                                />
                                <OSXInput
                                    initialValue={this.state.party.date.date()}
                                    onChange={(v: number) => this.updatePartyDate('date', v)}
                                    highlightColor={this.props.highlightColor}
                                    outerStyle={{
                                        width: 50,
                                        marginLeft: 10,
                                    }}
                                    inputStyle={{
                                        width: 50,
                                    }}
                                />
                                <OSXInput
                                    initialValue={this.state.party.date.year()}
                                    onChange={(v: number) => this.updatePartyDate('year', v)}
                                    highlightColor={this.props.highlightColor}
                                    outerStyle={{
                                        width: 75,
                                        marginLeft: 10,
                                    }}
                                    inputStyle={{
                                        width: 75,
                                    }}
                                />
                            </div>
                        </div>
                    </ListViewRow>
                    <ListViewRow>
                        <div>
                            <Label>Time</Label>
                            <div
                                style={{
                                    display: 'flex',
                                    flexFlow: 'row',
                                }}
                            >
                                <OSXInput
                                    initialValue={hour}
                                    onChange={(v: number) => this.updatePartyDate('hour', v)}
                                    highlightColor={this.props.highlightColor}
                                    outerStyle={{
                                        width: 50,
                                        marginLeft: 10
                                    }}
                                />
                                <Text
                                    style={{
                                        marginLeft: 5,
                                    }}
                                >:</Text>
                                <OSXInput
                                    initialValue={this.state.party.date.minute()}
                                    onChange={(v: number) => this.updatePartyDate('hour', v)}
                                    highlightColor={this.props.highlightColor}
                                    outerStyle={{
                                        width: 50,
                                        marginLeft: 10
                                    }}
                                />
                                <select value={isAm ? 'am' : 'pm'}
                                    onChange={(ev) => {
                                        let currentHour = this.props.party.date.hour();
                                        if (ev.currentTarget.value == 'am') {
                                            this.updatePartyDate('hour', currentHour - 12)
                                        } else {
                                            this.updatePartyDate('hour', currentHour + 12);
                                        }
                                    }}
                                >
                                    <option value={'am'}>AM</option>
                                    <option value={'pm'}>PM</option>
                                </select>
                            </div>
                        </div>
                    </ListViewRow>
                </ListViewSection>
                <ListViewSection>
                    <ListViewSectionHeader>
                        <Text>Where</Text>
                    </ListViewSectionHeader>
                    <ListViewRow
                        style={{
                            display: 'flex',
                            flexFlow: 'column',
                        }}
                    >
                        <Label>Place Name</Label>
                        <OSXInput
                            initialValue={this.props.party.place.name}
                            highlightColor={this.props.highlightColor}
                            onChange={(v: string) => console.log('update place name', v)}
                        />
                    </ListViewRow>
                    <ListViewRow style={{
                        display: 'flex',
                        flexFlow: 'column',
                    }}>
                        <Label>Address</Label>
                        <OSXInput
                            initialValue={this.props.party.place.address || ''}
                            highlightColor={this.props.highlightColor}
                            onChange={(v: string) => console.log('update place address', v)}
                        />
                    </ListViewRow>
                    <ListViewRow>
                        <div>
                        <Label>City</Label>
                        <OSXInput
                            initialValue={this.props.party.place.city || ''}
                            highlightColor={this.props.highlightColor}
                            onChange={(v: string) => console.log('update place city', v)}
                        />
                        </div>
                        <div
                            style={{
                                marginLeft: 5,
                                width: 50,
                            }}
                        >
                        <Label>State</Label>
                        <OSXInput
                            initialValue={this.props.party.place.state || ''}
                            highlightColor={this.props.highlightColor}
                            onChange={(v: string) => console.log('update place state', v)}
                        />
                        </div>
                        <div
                            style={{
                                marginLeft: 5,
                                width: 75,
                            }}
                        >
                        <Label>Zip</Label>
                        <OSXInput
                            initialValue={this.props.party.place.zip || ''}
                            highlightColor={this.props.highlightColor}
                            onChange={(v: string) => console.log('update place zip', v)}
                        />
                        </div>
                    </ListViewRow>
                    <ListViewRow style={{
                        display: 'flex',
                        flexFlow: 'column',
                    }}>
                        <Label>Place Desc.</Label>
                        <OSXInput
                            initialValue={this.props.party.place.description || ''}
                            highlightColor={this.props.highlightColor}
                            onChange={(v: string) => console.log('update place description', v)}
                            isMultiLine={true}
                        />
                    </ListViewRow>
                </ListViewSection>
                <ListViewSection>
                    <ListViewSectionHeader>
                        <Text>Details</Text>
                    </ListViewSectionHeader>
                    <ListViewRow>
                        <OSXInput
                            initialValue={this.props.party.description}
                            highlightColor={this.props.highlightColor}
                            onChange={(v: string) => console.log('update party description', v)}
                            isMultiLine={true}
                            inputStyle={{
                                height: 75,
                            }}
                        />
                    </ListViewRow>
                </ListViewSection>
            </ListView>
        )
    }

    updatePartyDate(comp: string, newValue: number) {
        this.setState((prev) => {
            let party = prev.party;
            party.date[comp](newValue);
            return { party, };
        })
    }
    updatePartyName(name: string) {
        this.setState((prev) => {
            let party = prev.party;
            party.name = name;
            return { party, };
        })
    }
}
