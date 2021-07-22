import { Component, createTextVNode, createRef } from "inferno";
import classNames from "classnames";
import "KaiUI/src/components/IconListItem/IconListItem.scss";
import morecolor from "../morecolor.scss";

const prefixCls = "kai-il";
const lineCls = `${prefixCls}-line`;
const itemCls = prefixCls;
const primaryCls = `${prefixCls}-line`;

class IconListItem extends Component {
  constructor(props) {
    super(props);
    this.secondaryCls = `${prefixCls}-secondary ${props.secondary ? "" : "hidden"}`;
    this.disabledCls = props.disabled ? `${prefixCls}-disabled` : "";
        this.divRef = createRef();
  }

  componentDidUpdate(lastProps, lastState) {
    if (this.props.isFocused) {
      this.divRef.current.focus();
    }
  }
  render() {
    const focusedCls = this.props.isFocused
      ? `${prefixCls}-focused ${this.focusClass || ""}`
      : "";
    const iconCls = `${prefixCls}-icon-${
      this.props.isFocused ? "focused" : "unfocused"
    }`;
    let renderedIcon;
    if (this.props.iconSrc)
      renderedIcon = <img src={this.props.iconSrc} alt="" width={this.props.iconWidth || 50} />;
    else if (this.props.icon instanceof String && this.props.icon.startsWith("kai"))
      renderedIcon = (
        <span className={this.props.icon} style={{ width: this.props.iconWidth }} />
      );
    // Then we assume it is a valid element TODO: check for this
    else renderedIcon = <span>{this.props.icon}</span>;

    return (
      <div
        tabIndex={this.disabled ? undefined : 1}
        className={classNames(
          itemCls,
          this.disabledCls,
          this.props.className,
          focusedCls
        )}
        onClick={this.props.onClick}
        key={this.props.isFocused}
        ref={this.divRef}
        style={{
          "background-color": this.props.isFocused
            ? morecolor.item_bg_focus_color
            : "",
        }}
      >
        <div className={iconCls}>{renderedIcon}</div>
        <div className={lineCls}>
          <span className={primaryCls} $HasVNodeChildren>
            {createTextVNode(this.props.primary)}
          </span>
          <label className={this.secondaryCls} $HasVNodeChildren>
            {createTextVNode(this.props.secondary)}
          </label>
        </div>
      </div>
    );
  }
}

export default IconListItem;