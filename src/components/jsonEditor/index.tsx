import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import './styles.css';
import { useRef, useEffect } from 'react';

export default function JsonEditor({
  json,
  onChange,
  setIsJsonInvalid,
}: {
  json: Object;
  onChange: (json: Object) => void;
  setIsJsonInvalid: (hasError: boolean) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const editor = useRef<JSONEditor | null>(null);

  useEffect(() => {
    if (container.current) {
      editor.current = new JSONEditor(container.current, {
        mode: 'code',
        mainMenuBar: true,
        navigationBar: true,
        statusBar: true,
        search: true,
        sortObjectKeys: true,
        history: true,
        enableSort: true,
        enableTransform: true,
        modes: ['code', 'form', 'text', 'tree', 'view'],
        onChange: () => {
          onChange(editor.current?.get());
        },
        onValidationError: (error) => {
          setIsJsonInvalid(error.length > 0);
        },
      });

      editor.current?.set(json);
    }

    return () => {
      if (editor.current) {
        editor.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div ref={container} className="w-full h-full" />
    </div>
  );
}
