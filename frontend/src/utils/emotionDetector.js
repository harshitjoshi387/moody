import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const TASKS_VISION_BASE_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";
const FACE_LANDMARKER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export async function createEmotionDetector() {
  const vision = await FilesetResolver.forVisionTasks(TASKS_VISION_BASE_URL);

  return FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: FACE_LANDMARKER_MODEL_URL,
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });
}

export async function startVideoStream(videoElement) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.srcObject = stream;
  await videoElement.play();
}

export function stopVideoStream(videoElement) {
  const stream = videoElement?.srcObject;

  if (!stream) {
    return;
  }

  stream.getTracks().forEach((track) => track.stop());
  videoElement.srcObject = null;
}

export function detectEmotionFromVideo(detector, videoElement) {
  if (!detector || !videoElement || videoElement.readyState !== 4) {
    return "";
  }

  const results = detector.detectForVideo(videoElement, performance.now());
  const blendshapes = results.faceBlendshapes?.[0]?.categories;

  if (!blendshapes?.length) {
    return "No Face Detected";
  }

  const getScore = (name) =>
    blendshapes.find((blendshape) => blendshape.categoryName === name)?.score ||
    0;

  const smile =
    (getScore("mouthSmileLeft") + getScore("mouthSmileRight")) / 2;
  const jawOpen = getScore("jawOpen");
  const browDown =
    (getScore("browDownLeft") + getScore("browDownRight")) / 2;

  if (smile > 0.6) {
    return "Happy";
  }

  if (jawOpen > 0.7) {
    return "Surprised";
  }

  if (browDown > 0.6) {
    return "Angry";
  }

  return "Neutral";
}
