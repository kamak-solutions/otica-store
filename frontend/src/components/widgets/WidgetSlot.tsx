import { useEffect, useState } from "react";

import { listWidgets, type Widget } from "../../services/widget.service";

import { WidgetRenderer } from "./WidgetRenderer";

type Props = {
  position: string;
};

export function WidgetSlot({ position }: Props) {
  const [widgets, setWidgets] = useState<Widget[]>([]);

  useEffect(() => {
    async function load() {
      const response = await listWidgets(position);

      setWidgets(response.data);
    }

    load();
  }, [position]);

  return (
    <>
      {widgets.map((widget) => (
        <WidgetRenderer key={widget.id} widget={widget} />
      ))}
    </>
  );
}
