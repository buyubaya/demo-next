import React from "react";
import { connect } from "react-redux";
import dynamic from 'next/dynamic'


class Test extends React.Component {
    static async getInitialProps(ctx){
        console.log("CTX", ctx);
        return { text: ctx.query.text };
    }

    constructor(props){
        super(props);

        this.state = {
            isClient: false
        };
    }

    componentDidMount(){
        console.log("DID MOUNT", this.state);
        // this.setState({ isClient: true });
    }

    render(){
        console.log("TEST PROPS", this.props, this.state);
        if (process.browser) {
            return(<h1 onClick={() => {
                console.log("CLICK");
                this.props.dispatch({ type: "FOO", payload: Math.random() * 10 });    
            }}>HELLO { this.props.text } - { this.props.foo }</h1>);
        }

        return null;
    }
}

// export default dynamic(
//     connect(
//         state => ({
//             store: state,
//             foo: state.foo
//         }),
//     )(Test)
//     ,
//     {
//         ssr: false
//     }
// );
export default connect(
    state => ({
        store: state,
        foo: state.foo
    }),
)(Test);