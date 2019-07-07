import React from "react";
import presets from "utils/presets";

const isSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

const Animation = ({
  texts,
}) => {
  const [rendering, setRendering] = React.useState([]);

  React.useEffect(() => {
    const sequence = presets.sequence.map((s, i) => {
      s = {
        ...presets.defaults,
        ...s,
        end: s.start + s.duration,
        id: i,
      };

      return {
        ...s,
        texts: (texts[i] || []).map((t, i) => {
          return {
            className: s.classes[i] || "",
            text: t,
          };
        }),
      };
    });

    const start = new Date();
    const getElapsed = () => {
      return new Date() - start;
    };

    setInterval(() => {
      const elapsed = getElapsed() / 1000;
      const renderingIds = new Set(rendering.map(s => s.id));
      const shouldRender = sequence.filter(s => s.start <= elapsed && s.end >= elapsed);
      const shouldRenderIds = new Set(shouldRender.map(s => s.id));
      const changed = !isSetsEqual(renderingIds, shouldRenderIds);
      if (changed) {
        setRendering(shouldRender);
      }
    }, 50);
  }, [])

  return <>
    {rendering.map((r) => {
      return (
        <div
          key={r.id}
          className="credit-text"
          style={{
            position: "absolute",
            top: `${r.y}vh`,
            left: `${r.x}vw`,
            animationDuration: `${r.duration}s`,
          }}
        >
          <div>
            {r.texts.map((t, i) => {
              return (
                <div
                  key={i}
                  className={t.className}
                  style={{
                    animationDuration: `${r.duration}s`,
                  }}
                >
                  { t.text }
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
  </>
}

export default Animation
