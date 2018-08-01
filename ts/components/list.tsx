import * as React from 'react';
import { ListView,
    ListViewSection,
    ListViewRow,
    Text } from 'react-desktop/macOs';
interface ListProps {
    elements: Array<string>;
    selectionColor: string;
    doubleClickHandler: (idx: number) => void;
}
interface ListState {
    selectedIdx?: number;
}

export default class List extends React.Component<ListProps, ListState> {
    constructor(props) {
        super(props);
        this.state = {
            selectedIdx: null,
        };
    }
    render() {
        return (
            <ListView
            >
            <ListViewSection
                background="white"
            >
                    {
                        this.props.elements.map((e, i) => {
                            return (
                                <ListViewRow
                                    key={`${e.toLowerCase().replace(/\s/g, '-')}-${i}`}
                                    background={i == this.state.selectedIdx ? this.props.selectionColor : 'transparent'}
                                    onClick={() => this.setState({selectedIdx: i})}
                                    onDoubleClick={ev => {
                                        console.log('ListViewRow.onDoubleClick', i, e, ev);
                                        this.props.doubleClickHandler(i)
                                    }}
                                >
                                    <Text
                                        color={'#5a5859'}
                                    >{e}</Text>
                                </ListViewRow>
                            )
                        })
                    }
                </ListViewSection>
            </ListView>
        )
    }
}
