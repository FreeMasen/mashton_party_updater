import * as React from 'react';
interface OSXInputProps<T> {
    outerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    initialValue: T;
    highlightColor: string;
    isMultiLine?: boolean;
    onChange: (v: T) => void;
}
interface OSXInputState<T> {
    value: T;
    focused: boolean;
}

export default class OSXInput<T> extends React.Component<OSXInputProps<T>, OSXInputState<T>> {
    private input: HTMLInputElement | HTMLTextAreaElement;
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.initialValue,
            focused: false,
        };
    }
    render() {
        let backgroundColor = this.state.focused ? this.props.highlightColor : 'transparent';
        return (
            <div
                onClick={() => this.input.focus()}
                style={Object.assign({
                    borderRadius: 4,
                    boxShadow: `1px 0px 0px 2px ${backgroundColor}, 0px 0px 0px 2px ${backgroundColor}, 0px 1px 0px 2px ${backgroundColor}, 0px 0px 0px 2px ${backgroundColor}`,

                }, this.props.outerStyle)}
            >
                {
                    this.props.isMultiLine ? (
                        <textarea
                            ref={i => this.input = i}
                            onFocus={() => this.setState({focused: true})}
                            onBlur={() => this.setState({focused: false})}
                            style={Object.assign({
                                borderRadius: 5,
                                width: this.props.outerStyle ? this.props.outerStyle.width : '100%',
                                height: this.props.outerStyle ? this.props.outerStyle.height : null,
                                margin: 0,
                                padding: 0,
                                border: `1px solid darkgrey`,
                                fontSize: '14pt',
                            }, this.props.inputStyle)}
                            value={this.state.value.toString()}
                            onChange={(ev) => this.setState({value: (ev.currentTarget as any).value})}
                        ></textarea>
                    ) : (
                        <input
                            ref={input => this.input = input}
                            onFocus={() => this.setState({focused: true})}
                            onBlur={() => this.setState({focused: false})}
                            style={Object.assign({
                                borderRadius: 5,
                                width: this.props.outerStyle ? this.props.outerStyle.width : '100%',
                                height: this.props.outerStyle ? this.props.outerStyle.height : null,
                                margin: 0,
                                padding: 0,
                                border: `1px solid darkgrey`,
                                fontSize: '14pt',
                            }, this.props.inputStyle)}
                            value={this.state.value.toString()}
                            onChange={(ev) => this.setState({value: (ev.currentTarget as any).value})}
                        />
                    )
                }
            </div>
        )
    }
}
