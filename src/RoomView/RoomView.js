import { Component } from "inferno";
import Header from "../ui/Header";
import SoftKey from "../ui/SoftKey";
import { IRCLikeMessageItem } from "../MessageItems";
import ChatTextInput from "../ChatTextInput";
import "./UnsupportedEventItem.css";
import "./RoomView.css";

function UnsupportedEventItem({ isFocused, senderId }) {
  return (
    <div className={"unsupportedevent" + (isFocused ? "--focused" : "")}>
      <p>Unsupported Event from {senderId}</p>
    </div>
  );
}

class RoomView extends Component {
  messageChangeCb = (message) => {
    this.setState({ message: message });
  };

  handleKeyDown = (evt) => {
    const VALID_KEYS = ["b", "Backspace", "ArrowDown", "ArrowUp"];
    // Backspace is used on an actual device
    // b is used for testing in desktop browser
    if (!VALID_KEYS.includes(evt.key)) {
      return;
    }
    const { cursor, textInputFocus, message } = this.state;
    const { closeRoomView } = this.props;
    const lastEventIndex = this.room.getLiveTimeline().getEvents().length - 1;
    if (VALID_KEYS.slice(0, 2).includes(evt.key)) {
      if (textInputFocus && message) return;
      evt.preventDefault();
      closeRoomView();
    } else if (evt.key === "ArrowDown") {
      if (textInputFocus) {
        this.setState({ textInputFocus: false, cursor: 0 });
      } else if (cursor === lastEventIndex) {
        this.setState({ textInputFocus: true });
      } else {
        this.setState({ cursor: cursor + 1 });
      }
    } else if (evt.key === "ArrowUp") {
      if (textInputFocus) {
        this.setState({ textInputFocus: false, cursor: lastEventIndex });
      } else if (cursor === 0) {
          this.setState({ textInputFocus: true });
      } else {
          this.setState({ cursor: cursor - 1 });
      }
    }
  };

  centerCb = () => {
    const { message, cursor } = this.state;
    const { roomId } = this.props;
    switch (this.getCenterText()) {
      case "Select":
        // TODO: start call or something
        break;
      case "Info":
        alert("Message Info not implemented yet");
        break;
      case "Send":
        if (message === "") {
          alert("Not sending empty message!");
          break;
        }
        window.mClient.sendTextMessage(roomId, message);
        this.setState({ message: "", cursor: cursor + 1 });
        break;
      default:
        break;
    }
  };

  getCenterText = () => {
    const { showMenu, textInputFocus } = this.state;
    if (showMenu) {
      return "Select";
    } else if (textInputFocus) {
      return "Send";
    } else {
      return "Info";
    }
  };

  constructor(props) {
    super(props);
    this.room = window.mClient.getRoom(props.roomId);
    if (this.room === null) {
      alert("Cannot retrieve room information");
      props.closeRoomView();
      return;
    }
    const lastEventIndex = this.room.getLiveTimeline().getEvents().length - 1;
    this.state = {
      showMenu: false,
      cursor: lastEventIndex,
      message: "",
      textInputFocus: true,
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }
  render() {
    const MessageItem = IRCLikeMessageItem;
    const { cursor, message, textInputFocus } = this.state;
    console.log(this.state);
    return (
      <>
        <Header text={this.room.calculateRoomName()} />
        <div className="eventsandtextinput">
          <div
            className={"kai-list-view"}
            style={{ height: "calc(100vh - 2.8rem - 40px - 32px)" }}
          >
            {this.room
              .getLiveTimeline()
              .getEvents()
              .map((evt, index, ary) => {
                let item = null;
                if (evt.getType() === "m.room.message") {
                  item = (
                    <MessageItem
                      sender={{ userId: evt.getSender() }}
                      content={evt.getContent()}
                    />
                  );
                } else {
                  item = <UnsupportedEventItem senderId={evt.getSender()} />;
                }
                if (item && !textInputFocus)
                  item.props.isFocused = index === cursor;
                return item;
              })}
          </div>
          <ChatTextInput
            message={message}
            onChangeCb={this.messageChangeCb}
            isFocused={textInputFocus}
          />
        </div>
        <footer>
          <SoftKey centerText={this.getCenterText()} centerCb={this.centerCb} />
        </footer>
      </>
    );
  }
}

export default RoomView;