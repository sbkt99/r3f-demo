import { useEffect, useState, useRef, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

const ANIMATION_FADE_TIME = 0.5;

const Claro_modelo = ({ items }) => {
  const group = useRef();
  const { scene, animations } = useGLTF('./models/Claro_modelo_p.glb');

  animations[0].name = "Saludo";
  animations[1].name = "Hablando";

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, mixer } = useAnimations(animations, group);

  const [animation, setAnimation] = useState("Saludo");
  const [audioDuration, setAudioDuration] = useState(null);
  const [isPlayingTalking, setIsPlayingTalking] = useState(false);
  const [shouldPlayAnimation, setShouldPlayAnimation] = useState(false);
  const [lastAssistantItem, setLastAssistantItem] = useState(null);

  function getAudioDurationFromBlobUrl(blobUrl) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(blobUrl);
      audio.addEventListener('loadedmetadata', () => resolve(audio.duration));
      audio.addEventListener('error', () => reject('Error loading the audio file'));
    });
  }

  // Monitorear los items para actualizar `shouldPlayAnimation` y obtener duración de audio
  useEffect(() => {
    const assistantItems = items.filter(conversationItem => conversationItem.role === 'assistant');
    
    if (assistantItems.length > 0) {
      const lastItem = assistantItems[assistantItems.length - 1];
      setLastAssistantItem(lastItem); // Guardar el último item con rol 'assistant'
      // Imprimir en consola el último item de assistant y su status
      console.log('Último item de assistant:', lastItem);
      console.log('Estado del último item de assistant:', lastItem.status);
      
      // Verificamos si el estado del último item es 'completed'
      if (lastItem.status === 'completed') {
        setShouldPlayAnimation(false); // Detenemos la animación cuando el estado es 'completed'
      } else {
        setShouldPlayAnimation(true); // Continuamos la animación si el estado no es 'completed'
      }

      const hasAudio = lastItem.formatted?.file?.url;
      if (hasAudio) {
        getAudioDurationFromBlobUrl(hasAudio)
          .then(duration => {
            console.log(`Audio Duration Updated for Assistant: ${duration}`);
            setAudioDuration(duration); // Configurar la duración del audio
          })
          .catch(error => console.error(error));
      }
    } else {
      setShouldPlayAnimation(false); // Si no hay items de 'assistant', detener animación
    }
  }, [items]); // Este efecto se ejecuta cada vez que cambian los 'items'

  // Efecto para manejar el cambio de animación basado en `shouldPlayAnimation` y `audioDuration`
  useEffect(() => {
    if (lastAssistantItem && (lastAssistantItem.status === "in progress" || lastAssistantItem.status === "completed") && audioDuration !== null) {
      setAnimation("Hablando");
      setIsPlayingTalking(true);
  
      console.log(`Reproduciendo animación "Hablando" con estado: ${lastAssistantItem.status}`);
  
      // Configuramos el timeout solo si el estado es "completed"
      if (lastAssistantItem.status === "completed") {
        const timeout = setTimeout(() => {
          setAnimation("Saludo"); // Cambiamos a "Saludo" al completar el tiempo
          setIsPlayingTalking(false);
        }, (audioDuration - 1) * 1000); // Convertir a milisegundos
  
        // Limpiar el timeout cuando cambie `lastAssistantItem` o `audioDuration`
        return () => clearTimeout(timeout);
      }
    } else {
      setAnimation("Saludo");
      setIsPlayingTalking(false);
    }
  }, [lastAssistantItem, audioDuration]);
  
  

  // Efecto para controlar la ejecución de la animación actual sin superposición
  useEffect(() => {
    if (actions[animation]) {
      actions[animation]
        .reset()
        .fadeIn(mixer.time > 0 ? ANIMATION_FADE_TIME : 0)
        .play();
    }

    return () => {
      if (actions[animation]) {
        actions[animation].fadeOut(ANIMATION_FADE_TIME);
      }
    };
  }, [animation, actions]);

  return (
    <group ref={group}>
      <primitive object={clone} position={[-0.5, -120, 0]} />
    </group>
  );
};

export default Claro_modelo;

useGLTF.preload('./models/Claro_modelo_p.glb');
