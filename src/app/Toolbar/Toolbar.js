const { IconSize, ReliefStyle } = imports.gi.Gtk;
const Component = require("inferno-component").default;
const h = require("inferno-hyperscript").default;
const { connect } = require("inferno-mobx");
const { ActionService } = require("../Action/ActionService");
const autoBind = require("../Gjs/autoBind").default;
const { JobService } = require("../Job/JobService");
const { TabService } = require("../Tab/TabService");
const ToggleButton = require("../ToggleButton/ToggleButton").default;

/**
 * @typedef IProps
 * @property {ActionService} actionService
 * @property {JobService} jobService
 * @property {TabService} tabService
 *
 * @param {IProps} props
 */
function Toolbar(props) {
  Component.call(this, props);
  autoBind(this, Toolbar.prototype, __filename);
}

Toolbar.prototype = Object.create(Component.prototype);

/**
 * @type {IProps}
 */
Toolbar.prototype.props = undefined;

Toolbar.prototype.handlePressed = function(type) {
  return () => this.props.actionService[type]();
};

Toolbar.prototype.render = function() {
  const items = [
    { type: "refresh", icon_name: "view-refresh", tooltip_text: "Refresh" },
    "mode",
    { sensitive: false, icon_name: "format-justify-left", tooltip_text: "List" },
    { active: true, icon_name: "format-justify-fill", tooltip_text: "Table" },
    "history",
    { type: "back", icon_name: "go-previous", tooltip_text: "Back" },
    { type: "forward", icon_name: "go-next", tooltip_text: "Forward" },
    "misc",
    { type: "ls", icon_name: "go-jump", tooltip_text: "Go to URI" },
    { type: "touch", icon_name: "document-new", tooltip_text: "Create file" },
    { type: "terminal", icon_name: "utilities-terminal", tooltip_text: "Terminal" },
    {
      active: this.props.tabService.showHidSys,
      icon_name: "dialog-warning",
      tooltip_text: "Hidden files",
      type: "showHidSys",
    },
    "progress",
  ];

  let totalCount = 0;
  let totalDoneCount = 0;

  if (this.props.jobService) {
    for (const pid of this.props.jobService.pids) {
      const job = this.props.jobService.jobs[pid];

      totalCount += job.totalCount;
      totalDoneCount += job.totalDoneCount;
    }
  }

  return (
    h("box", [
      items.map(item => {
        if (item === "progress" && !totalDoneCount) {
          return null;
        }

        if (item === "progress") {
          return h("button", {
            key: "progress",
            label: Math.round(totalCount / totalDoneCount * 100) + "%",
            relief: ReliefStyle.NONE,
          });
        }

        if (typeof item === "string") {
          return h("v-separator", { key: item });
        }

        return (
          h(ToggleButton, {
            active: !!item.active,
            can_focus: false,
            key: item.icon_name,
            on_pressed: "type" in item ? this.handlePressed(item.type) : null,
            relief: ReliefStyle.NONE,
            sensitive: "sensitive" in item ? item.sensitive : null,
            tooltip_text: item.tooltip_text,
          }, [
            h("image", {
              icon_name: item.icon_name + "-symbolic",
              icon_size: IconSize.SMALL_TOOLBAR,
            }),
          ])
        );
      }),
    ])
  );
};

exports.Toolbar = Toolbar;
exports.default = connect(["actionService", "jobService", "tabService"])(Toolbar);
