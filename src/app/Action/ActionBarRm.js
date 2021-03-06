const { DragAction } = imports.gi.Gdk;
const { Button, DestDefaults, ReliefStyle } = imports.gi.Gtk;
const Component = require("inferno-component").default;
const { connect } = require("inferno-mobx");
const Nullthrows = require("nullthrows").default;
const { Drag } = require("../Drag/Drag");
const { autoBind } = require("../Gjs/autoBind");
const { h } = require("../Gjs/GtkInferno");
const { JobService } = require("../Job/JobService");
const { PanelService } = require("../Panel/PanelService");
const { SelectService } = require("../Select/SelectService");

/**
 * @typedef IProps
 * @property {JobService?} [jobService]
 * @property {PanelService?} [panelService]
 * @property {SelectService?} [selectService]
 * @property {string} label
 *
 * @extends Component<IProps>
 */
class ActionBarRm extends Component {
  /**
   * @param {IProps} props
   */
  constructor(props) {
    super(props);
    autoBind(this, ActionBarRm.prototype, __filename);
  }

  /**
   * @param {{ uris: string[] }} ev
   */
  handleDrop(ev) {
    const { run } = Nullthrows(this.props.jobService);
    const { refresh } = Nullthrows(this.props.panelService);

    run({
      destUri: "",
      type: "rm",
      uris: ev.uris,
    }, refresh);
  }

  handlePressed() {
    const { rm } = Nullthrows(this.props.selectService);
    rm();
  }

  /**
   * @param {Button | null} node
   */
  ref(node) {
    if (!node) {
      return;
    }

    new Drag(node, { action: DragAction.MOVE }).onDrop(this.handleDrop);
    node.connect("pressed", this.handlePressed);
  }

  render() {
    return (
      h(Button, {
        can_focus: false,
        expand: true,
        label: this.props.label,
        ref: this.ref,
        relief: ReliefStyle.NONE,
      })
    );
  }
}

exports.ActionBarRm = ActionBarRm;
exports.default = connect(["jobService", "panelService", "selectService"])(
  ActionBarRm,
);
