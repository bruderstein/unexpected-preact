/*global unexpected:true, Preact:true, h:true */

require( './src/tests/helpers/emulateDom');

global.unexpected = require('unexpected');
unexpected.output.preferredWidth = 80;
unexpected.use(require('./src/unexpected-preact'));

global.Preact = require('preact');
global.h = Preact.h;
global.Component = Preact.Component;


class TodoItem extends Preact.Component {
    constructor() {
        super();
        this.state = {
            completed: false
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState({
            completed: true
        });
    }

    render() {
        return (
            <div
              id={'todo-' + this.props.id}
              className={`item ${ this.state.completed ? 'completed' : 'incomplete'}`}
              onClick={this.onClick}
            >
                <span className="id">{this.props.id}</span>
                <span className="label">{this.props.label}</span>
                <span>{this.state.completed ? 'Completed!' : 'Todo'}</span>
            </div>
        );
    }
}

class TodoList extends Preact.Component {

    constructor() {
        super();
        this.state = { clicked: {} };
        this.onClick = this.onClick.bind(this);
    }

    onClick(index) {
        // State mutation, this is not recommended, but saves us rebuilding each time
        this.state.clicked[index] = true;
        this.setState({
            clicked: this.state.clicked
        });
    }

    noop() {}

    render() {
        const children = this.props.children.map(child => {
            return Preact.cloneElement(child, { 
                key: child.attributes.id,
                onClick: this.onClick.bind(this, child.attributes.id),
                clicked: !!this.state.clicked[child.attributes.id],
                onMouseDown: this.noop
            });
        });

        return (
            <div>
                <div className="items">
                    { children }
                </div>
                <div className="add-new-item">
                   <input placeholder="Enter something to do" />
                </div>
            </div>
        );
    }
}

class App extends Preact.Component {

    constructor() {
        super();
        this.state = { clickTestClicked: false };
        this.onClickTest = this.onClickTest.bind(this);
    }

    onClickTest() {
        this.setState({ clickTestClicked: true });
    }

    render() {
        return (
            <div>
                    <div className="other-button"><button>Not clicked</button></div>
                    <div className="click-test">
                        <button className="click-test" onClick={this.onClickTest}>
                            {this.state.clickTestClicked ? 'Button was clicked' : 'Not clicked'}
                        </button>
                    </div>
            </div>
        );
    }
}

global.TodoItem = TodoItem;
global.TodoList = TodoList;
global.App = App;

class MyButton extends Preact.Component {
    constructor () {
        super();
        this.state = {
            count: 0
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick () {
        const { count } = this.state;
        this.setState({ count: count + 1 });
    }

    render() {
        const { count } = this.state;

        return (
            <button onClick={ this.onClick }>
                Button was clicked { count } times
            </button>
        );
    }
}

global.MyButton = MyButton;
