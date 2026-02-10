"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const THEMES = ["light", "dark", "pro"] as const;
type Theme = (typeof THEMES)[number];

type ChatMessage = {
  user: string;
  text: string;
  ts: number;
  isFollower?: boolean;
};

let socket: Socket | null = null;

export default function LivePage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [user] = useState(() => "User-" + Math.floor(Math.random() * 9999));

  const [role, setRole] = useState<"host" | "viewer">("viewer");

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const peers = useRef<{ [id: string]: RTCPeerConnection }>({});

  // Detectar rol desde URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("role");
    if (r === "host") setRole("host");
  }, []);

  // Aplicar tema
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // SOCKET.IO + WEBRTC LISTENERS
  useEffect(() => {
    if (!socket) {
      socket = io("http://103.124.105.28:4000", {
        transports: ["websocket"],
      });
    }

    // VIEWER RECIBE OFFER DEL HOST
    socket.on("webrtc:offer", async ({ offer, hostId }) => {
      if (role !== "viewer") return;

      console.log("📡 Viewer: Offer recibida del host");

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peers.current[hostId] = pc;

      const stream = new MediaStream();
      setRemoteStream(stream);

      pc.ontrack = (event) => {
        stream.addTrack(event.track);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("webrtc:ice", {
            target: hostId,
            candidate: event.candidate,
          });
        }
      };

      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc:answer", { hostId, answer });
    });

    // HOST RECIBE ANSWER DEL VIEWER
    socket.on("webrtc:answer", async ({ viewerId, answer }) => {
      const pc = peers.current[viewerId];
      if (!pc) return;
      console.log("📡 Host: Answer recibida del viewer");
      await pc.setRemoteDescription(answer);
    });

    // ICE CANDIDATES
    socket.on("webrtc:ice", async ({ from, candidate }) => {
      const pc = peers.current[from];
      if (!pc) return;
      await pc.addIceCandidate(candidate);
    });

    return () => {
      socket?.off("webrtc:offer");
      socket?.off("webrtc:answer");
      socket?.off("webrtc:ice");
    };
  }, [role]);

  // VIEWER: AVISAR QUE ENTRÓ AL LIVE
  useEffect(() => {
    if (!socket) return;
    if (role !== "viewer") return;

    socket.emit("viewer:join");
    console.log("👀 Viewer conectado al LIVE");
  }, [role]);

  // HOST: INICIAR CÁMARA
  const startHostStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);

      const video = document.getElementById("localVideo") as HTMLVideoElement;
      if (video) video.srcObject = stream;

      console.log("🎥 Host: cámara iniciada");

      socket?.emit("host:ready");
    } catch (err) {
      console.error("Error al iniciar cámara:", err);
    }
  };

  // HOST: CREAR PEER PARA CADA VIEWER
  const createPeerForViewer = async (viewerId: string) => {
    console.log("👤 Host: creando peer para viewer", viewerId);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peers.current[viewerId] = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("webrtc:ice", {
          target: viewerId,
          candidate: event.candidate,
        });
      }
    };

    localStream?.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket?.emit("webrtc:offer", { viewerId, offer });
  };

  // HOST: CUANDO UN VIEWER ENTRA
  useEffect(() => {
    if (!socket) return;

    socket.on("viewer:join", ({ viewerId }) => {
      console.log("👤 Nuevo viewer:", viewerId);
      createPeerForViewer(viewerId);
    });

    return () => {
      socket?.off("viewer:join");
    };
  }, [localStream]);

  return (
    <div className="relative w-full h-full">

      {/* BOTÓN DEL HOST */}
      {role === "host" && (
        <button
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium absolute z-50 top-4 left-4"
          onClick={startHostStream}
        >
          Iniciar Transmisión
        </button>
      )}

      {/* VIDEO DEL HOST */}
      {role === "host" && (
        <video
          id="localVideo"
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover absolute inset-0"
        ></video>
      )}

      {/* VIDEO DEL VIEWER */}
      {role === "viewer" && (
        <video
          id="remoteVideo"
          autoPlay
          playsInline
          className="w-full h-full object-cover absolute inset-0"
          ref={(el) => {
            if (el && remoteStream) {
              el.srcObject = remoteStream;
              el.play().catch(() => {});
            }
          }}
        ></video>
      )}

    </div>
  );
}
