import * as React from 'react';
import List from './list';
import {} from '../model/foreignTypes';
import User from '../../../mashton.party/app/models/user';
import PartyForm from './partyForm';
import GuestForm from './guestForm';
import { ListView,
    ListViewSection,
    ListViewRow,
    Text, Toolbar, ToolbarNav, ToolbarNavItem } from 'react-desktop/macOs';
interface DashboardProps {
    parties: Array<Party>,
    users: Array<User>,
    selectionColor: string;
    titleChange: (newTitle: string) => void;
}
interface DashboardState {
    dashboardContent: DashboardContent;
    detailIdx?: number;
}

export default class Dashboard extends React.Component<DashboardProps, DashboardState> {
    private currentList: List;
    constructor(props) {
        super(props);
        this.state = {
            dashboardContent: DashboardContent.Parties,
        }
    }
    render() {
        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: '8% 92%',
                    gridTemplateColumns: '25% 75%',
                    gridTemplateAreas: `
                    "head    head"
                    "sidebar content"`,
                    width: "800px",
                    height: "600px",
                    overflow: 'hidden',
                }}
            >
                <Toolbar style={{
                    gridArea: 'head',
                    backgroundColor: '#e1dee1'
                }}>
                    <ToolbarNav>
                        <ToolbarNavItem
                        icon={<Text>hahahahahha</Text>} />
                    </ToolbarNav>
                </Toolbar>
                <div style={{
                    gridArea: 'sidebar',
                    backgroundColor: '#d8d6d8',
                    borderRight: '2px solid #e1dee1',
                }}>
                    <ListView>
                        <ListViewSection>
                            <ListViewRow
                                background={this.state.dashboardContent == DashboardContent.Parties ? this.props.selectionColor : 'transparent'}
                                onClick={() => this.changeContent(DashboardContent.Parties)}
                            >
                                <Text
                                    color="#5a5859"
                                >
                                    Parties
                                </Text>
                            </ListViewRow>
                            <ListViewRow
                                background={this.state.dashboardContent == DashboardContent.Guests ? this.props.selectionColor : 'transparent'}
                                onClick={() => this.changeContent(DashboardContent.Guests)}
                            >
                                <Text
                                    color="#5a5859"
                                >
                                    Guests
                                </Text>
                            </ListViewRow>
                        </ListViewSection>
                    </ListView>
                </div>
                <div style={{
                    gridArea: 'content'
                }}>
                    {
                        this.chooseContent()
                    }
                </div>
            </div>
        )
    }

    chooseContent() {
        switch (this.state.dashboardContent) {
            case DashboardContent.Guests:
                return (
                    <List
                        elements={this.props.users.map(u => u.name)}
                        selectionColor={this.props.selectionColor}
                        ref={l => this.currentList = l}
                        doubleClickHandler={idx => this.selectGuest(idx)}
                    />
                );
            case DashboardContent.PartyForm:
                let party = this.state.detailIdx !== null &&
                            this.state.detailIdx < this.props.parties.length &&
                            this.state.detailIdx > -1 ?
                            this.props.parties[this.state.detailIdx] : null;
                return (
                    <PartyForm
                        party={party}
                        highlightColor={this.props.selectionColor}
                    />
                )
            case DashboardContent.GuestForm:
            let guest = this.state.detailIdx !== null &&
                        this.state.detailIdx < this.props.users.length &&
                        this.state.detailIdx > -1 ?
                        this.props.users[this.state.detailIdx] : null;
                console.log('rendering guest form');
                return (
                    <GuestForm
                        highlightColor={this.props.selectionColor}
                        guest={guest}
                        parties={this.props.parties}
                    />
                )
            default:
                return (
                    <List
                        elements={this.props.parties.map(p => p.name)}
                        selectionColor={this.props.selectionColor}
                        ref={l => this.currentList = l}
                        doubleClickHandler={idx => this.selectedParty(idx)}
                    />
                )
        }
    }

    changeContent(dashboardContent: DashboardContent) {
        switch (dashboardContent) {
            case DashboardContent.Parties:
                this.props.titleChange(dashboardContent);
            break;
            case DashboardContent.Guests:
                this.props.titleChange(dashboardContent);
            break;
        }
        this.setState({dashboardContent: dashboardContent});
    }

    selectedParty(idx?: number) {
        console.log('selectedParty', idx);
        if (this.state.dashboardContent !== DashboardContent.Parties) {
            return;
        }
        this.setState({dashboardContent: DashboardContent.PartyForm,
                        detailIdx: idx});
    }

    selectGuest(idx?: number) {
        console.log('selectGuest', idx);
        if (this.state.dashboardContent !== DashboardContent.Guests) {
            return;
        }
        this.setState({dashboardContent: DashboardContent.GuestForm,
                        detailIdx: idx});
    }

    public getSelectedItem(): User | Party | string {
        let idx = this.currentList.state.selectedIdx;
        if (idx === null || idx < 0) return 'No selection';
        if (this.state.dashboardContent == DashboardContent.Parties) {
            return this.props.parties[idx];
        } else if (this.state.dashboardContent == DashboardContent.Guests) {
            return this.props.users[idx];
        }
    }
}

enum DashboardContent {
    Parties = "Parties",
    Guests = "Guests",
    PartyForm = "PartyForm",
    GuestForm = "GuestForm",
}