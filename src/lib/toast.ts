import { toastController } from "@ionic/vue";
import { checkmarkCircle, closeCircle } from "ionicons/icons";

export class Toast {
  private static createToast = async ({
    message,
    icon,
    color,
  }: {
    message: string;
    icon: string;
    color: string;
  }) => {
    return await toastController.create({
      message,
      icon,
      duration: 1500,
      color,
    });
  };
  public static success = async (message: string) => {
    const toast = await this.createToast({
      message,
      icon: checkmarkCircle,
      color: "success",
    });
    toast.present();
  };
  public static error = async (message: string) => {
    const toast = await this.createToast({
      message,
      icon: closeCircle,
      color: "danger",
    });
    toast.present();
  };
}
