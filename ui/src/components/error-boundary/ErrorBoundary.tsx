import React, {ReactNode} from "react";

interface IErrorProps {
    children?: ReactNode;
}

interface IErrorState {
    error?: {};
    errorInfo?: {}
}

export class ErrorBoundary extends React.Component<IErrorProps, IErrorState> {
    state = {error: null, errorInfo: null};

    constructor(props) {
        super(props);
        this.state = {errorInfo: null, error: null};
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.errorInfo) {
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{whiteSpace: "pre-wrap"}}>
                        {this.state.error && this.state.error.toString()}
                        <br/>
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}
