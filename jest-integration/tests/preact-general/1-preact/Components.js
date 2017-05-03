import Preact, {h} from 'preact';

export class Message extends Preact.Component {

  constructor() {
    super();
    this.state = { count: 0 };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({ count: this.state.count + 1});
  }

  render() {
    const { msg } = this.props;
    return <span onClick={this.onClick}>{msg} {this.state.count}</span>;
  }
}

export class Clicker extends Preact.Component {

  constructor() {
    super();
    this.state = { count: 0 };

    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  onMouseDown(e) {
    this.setState({ count: this.state.count + e.clientX })
  }

  onClick(e) {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    return (
      <div className="multiple foo" onClick={this.onClick} onMouseDown={this.onMouseDown}>
        <StatelessWrapper msg={'Clicked ' + this.state.count} id="foo"/>
      </div>
    )
  }
}

Clicker.displayName = 'ClickerDisplay';

export function Multiple() {
  return (
    <div>
      <Clicker className="one" />
      <Clicker className="two" />
    </div>
  );
}

export function Stateless({ msg }) {
  return <span className="stateless">{msg}</span>
}

export function StatelessWrapper({ msg }) {
  return <Stateless msg={msg} />;
}


