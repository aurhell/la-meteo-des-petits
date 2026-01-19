import { ref } from "vue"

const NOTIFICATION_TITLE = "La météo des petits"
const NOTIFICATION_PERMISSION_KEY = "notification_permission_requested"

type NotificationType = "rain" | "snow" | "storm"

const notificationMessages: Record<NotificationType, { title: string; body: string }> = {
  rain: {
    title: NOTIFICATION_TITLE,
    body: "☔ Prends ton parapluie! Il va pleuvoir!",
  },
  snow: {
    title: NOTIFICATION_TITLE,
    body: "❄️ Attention! Il va neiger! Mets un manteau bien chaud!",
  },
  storm: {
    title: NOTIFICATION_TITLE,
    body: "⛈️ Attention orage! Reste à l'intérieur!",
  },
}

const hasNotificationSupport = (): boolean => {
  return "Notification" in window && "serviceWorker" in navigator
}

const requestPermission = async(): Promise<NotificationPermission | null> => {
  if (!hasNotificationSupport()) {
    console.warn("Web Notifications not supported")
    return null
  }

  const currentPermission = Notification.permission
  if (currentPermission === "granted" || currentPermission === "denied") {
    return currentPermission
  }

  try {
    const permission = await Notification.requestPermission()
    localStorage.setItem(NOTIFICATION_PERMISSION_KEY, "true")
    return permission
  } catch (error) {
    console.warn("Failed to request notification permission:", error)
    return null
  }
}

const showNotification = async(type: NotificationType): Promise<void> => {
  if (!hasNotificationSupport()) return
  if (Notification.permission !== "granted") return

  try {
    const message = notificationMessages[type]
    const options: NotificationOptions = {
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: `weather-${type}`,
      requireInteraction: false,
    }

    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_NOTIFICATION",
        title: message.title,
        options,
        body: message.body,
      })
    } else {
      new Notification(message.title, {
        ...options,
        body: message.body,
      })
    }
  } catch (error) {
    console.warn("Failed to show notification:", error)
  }
}

const hasAskedForPermission = (): boolean => {
  return localStorage.getItem(NOTIFICATION_PERMISSION_KEY) === "true"
}

export const useNotifications = () => {
  const permissionStatus = ref<NotificationPermission | null>(
    hasNotificationSupport() ? Notification.permission : null,
  )

  return {
    permissionStatus,
    hasNotificationSupport,
    requestPermission,
    showNotification,
    hasAskedForPermission,
  }
}
