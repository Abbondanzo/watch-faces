import * as messaging from "messaging";

interface Message {
  key: string;
  value: any;
}

type Callback<T> = (data: T) => void;

export const sendMessage = async (key: string, value: any) => {
  const data: Message = { key, value };
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
    setTimeout(() => sendMessage(key, value), 1000);
  }
};

export const receiveMessage = <T>(key: string, callback: Callback<T>) => {
  messaging.peerSocket.addEventListener("message", (event) => {
    const message: Message = event.data;
    if (message.key === key) {
      callback(message.value);
    }
  });
};
