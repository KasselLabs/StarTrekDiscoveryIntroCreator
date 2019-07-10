import React from 'react';
import presets from 'utils/presets';
import intro from '../../assets/video/intro.mp4';

const isSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

// This variable is just used to communicate with setInterval
let renderingCache;

const Animation = ({
  texts,
}) => {
  const video = React.useRef(null);
  const [rendering, setRendering] = React.useState([]);
  const [delays, setDelays] = React.useState({});
  renderingCache = rendering;
  const [paused, setPaused] = React.useState(true);

  React.useEffect(() => {
    let initialized = false;
    const start = () => {
      initialized = true;
      video.current.play();
      const sequence = presets.sequence.map((s, i) => {
        s = {
          ...presets.defaults,
          ...s,
          id: i,
        };

        if (s.end) {
          s.duration = s.end - s.start;
        } else if (s.duration) {
          s.end = s.start + s.duration;
        }


        return {
          ...s,
          texts: (texts[i] || []).map((t, i) => ({
            className: s.classes[i] || '',
            text: t,
          })),
        };
      });

      setInterval(() => {
        const elapsed = video.current.currentTime;
        const renderingIds = new Set(renderingCache.map(s => s.id));
        const shouldRender = sequence.filter(s => s.start <= elapsed && s.end >= elapsed);
        const shouldRenderIds = new Set(shouldRender.map(s => s.id));
        const changed = !isSetsEqual(renderingIds, shouldRenderIds);
        if (changed) {
          setRendering(shouldRender);
        }
      }, 50);
    };
    video.current.addEventListener('canplaythrough', () => {
      if (!initialized) {
        start();
      }
    });
    video.current.addEventListener('pause', () => setPaused(true));
    video.current.addEventListener('play', () => setPaused(false));
    video.current.addEventListener('seeked', () => {
      const elapsed = video.current.currentTime;
      const delays = {};
      renderingCache.forEach(({ id, start }) => {
        delays[id] = (start - elapsed).toFixed(2);
      });
      setDelays(delays);
    });
  }, []);

  return (
    <>
      <video muted controls ref={video} className="intro" src={intro} />
      {rendering.map(r => (
        <div
          key={r.id}
          className="credit-text"
          style={{
            position: 'absolute',
            top: `${r.y}vh`,
            left: `${r.x}vw`,
            animationDuration: `${r.duration}s`,
            animationPlayState: paused ? 'paused' : 'running',
            animationDelay: `${delays[r.id] || 0}s`,
          }}
        >
          <div>
            {r.texts.map((t, i) => (
              <div
                key={i}
                className={t.className}
                style={{
                  animationDuration: `${r.duration}s`,
                  animationPlayState: paused ? 'paused' : 'running',
                  animationDelay: `${delays[r.id] || 0}s`,
                }}
              >
                { t.text }
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default Animation;
