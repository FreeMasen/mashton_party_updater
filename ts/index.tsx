import * as React from 'react';
import * as ReactDom from 'react-dom';
import Party from '../../../mashton.party/app/models/party';
import User from '../../../mashton.party/app/models/user';
import Data from './services/data';
import Dashboard from './components/dashboard';

export default class RustState {
    constructor(
        public parties: Array<Party> = [],
        public users: Array<User> = [],
        public cssHex: string = '#c6c6c0',
    ) {}
}

class AppState {
    constructor(
        public currentContent: AppContent = AppContent.Dashboard,
        public rustState: RustState = new RustState(),
    ) {}
}

class App extends React.Component<{}, AppState> {
    data: Data;
    dashboard?: Dashboard;
    constructor(props) {
        super(props);
        this.state = new AppState();
        this.data = new Data();
    }
    componentDidMount() {
        this.data.registerListener(s => this.setState({rustState: s}));
    }
    render() {
        console.log('App.render', this.state);
        return (
            <main>
                {
                    this.chooseContent()
                }
            </main>
        )
    }
    chooseContent()  {
        // empty all refs as they will be invalid
        this.dashboard = null;

        //choose new component based on state
        switch (this.state.currentContent) {
            default:
                this.updateTitle();
                return (
                    <Dashboard
                        parties={this.state.rustState.parties}
                        users={this.state.rustState.users}
                        selectionColor={this.state.rustState.cssHex}
                        titleChange={newTitle => this.updateTitle(newTitle)}
                    />
                )
        }
    }

    updateTitle(subTitle?: string) {
        console.log('updateTitle', subTitle)
        if (!subTitle) {
            subTitle = '';
        } else {
            subTitle = ` - ${subTitle}`;
        }
        this.data.setTitle(`${this.state.currentContent}${subTitle}`)
    }
}

enum AppContent {
    Dashboard = "Dashboard",
}



ReactDom.render(<App/>, document.getElementById('app'));