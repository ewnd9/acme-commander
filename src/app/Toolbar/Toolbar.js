const { Box, IconSize, Image, ReliefStyle, VSeparator } = imports.gi.Gtk;
const Component = require("inferno-component").default;
const { connect } = require("inferno-mobx");
const { ActionService } = require("../Action/ActionService");
const { autoBind } = require("../Gjs/autoBind");
const { h } = require("../Gjs/GtkInferno");
const { TabService } = require("../Tab/TabService");
const ToggleButton = require("../ToggleButton/ToggleButton").default;
const ToolbarJobs = require("./ToolbarJobs").default;

const items = [
  {
    icon: "view-refresh",
    id: "windowService.refresh",
    label: "Refresh",
  },

  "mode",

  {
    icon: "format-justify-left",
    id: "",
    label: "List",
  },

  {
    icon: "format-justify-fill",
    id: "",
    label: "Table",
  },

  "history",

  {
    icon: "go-previous",
    id: "panelService.back",
    label: "Back",
  },

  {
    icon: "go-next",
    id: "panelService.forward",
    label: "Forward",
  },

  "misc",

  {
    icon: "go-jump",
    id: "panelService.ls",
    label: "Go to URI",
  },

  {
    icon: "document-new",
    id: "directoryService.touch",
    label: "Create file",
  },

  {
    icon: "utilities-terminal",
    id: "directoryService.terminal",
    label: "Terminal",
  },

  {
    icon: "dialog-warning",
    id: "windowService.showHidSys",
    label: "Hidden files",
  },

  "jobs-",

  "jobs",
];

/**
 * @typedef {{ [key: string]: any }} IProps
 * @property {ActionService?} [actionService]
 * @property {TabService?} [tabService]
 *
 * @extends Component<IProps>
 */
class Toolbar extends Component {
  /**
   * @param {IProps} props
   */
  constructor(props) {
    super(props);
    autoBind(this, Toolbar.prototype, __filename);
  }

  render() {
    const { actionService, tabService } = this.props;

    return (
      h(Box, items.map(item => {
        if (item === "jobs-") {
          return h(Box, { hexpand: true, key: item });
        }

        if (item === "jobs") {
          return h(ToolbarJobs, { key: item });
        }

        if (typeof item === "string") {
          return h(VSeparator, { key: item });
        }

        return (
          h(ToggleButton, {
            active:
              item.icon === "format-justify-fill" ||
              (item.id === "windowService.showHidSys" && tabService.showHidSys),
            can_focus: false,
            key: item.icon,
            pressedCallback: item.id ? actionService.get(item.id).handler : null,
            relief: ReliefStyle.NONE,
            sensitive: item.icon !== "format-justify-left",
            tooltip_text: item.label,
          }, [
              h(Image, {
                icon_name: item.icon + "-symbolic",
                icon_size: IconSize.SMALL_TOOLBAR,
              }),
            ])
        );
      }))
    );
  }
}

exports.Toolbar = Toolbar;
exports.default = connect(["actionService", "tabService"])(Toolbar);
