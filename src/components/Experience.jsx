"use client"
import { Box, Gltf,OrbitControls,CameraControls, Environment, Html, Plane, useTexture} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { useRef, useEffect} from "react";
import { degToRad } from "three/src/math/MathUtils";
import { useControls,button, Leva} from 'leva';
import { TypingBox } from "./TypingBox";
//import { MessagesList } from "./MessagesList";
import Claro_modelo from "./Claro_modelo";

//[-2.960189873059607, 9.366746889166946e-15, 152.94194086618435]
//conversation2: [5.345443388324474, 9.892387265907366e-15, 161.46648641430895],
const Background = () => {
    const texture = useTexture('/Claro-Logo.png'); // Ruta a la imagen de fondo

    return (
        <Plane scale={100} position={[0, 100, -170]}>
            <meshBasicMaterial 
                attach="material" 
                map={texture} 
                transparent={true}    // Activar la transparencia
                alphaTest={0.5}       // Mejorar la precisión de la transparencia
            />
        </Plane>
    );
}

export const Experience = ({items}) => {
    return (
        <>
            <Loader hidden/>
            <Leva hidden/>
            <Canvas camera={{
                position: [0,30,150],
                }}>
                {<CameraManager items={items}/>}
                {/*<OrbitControls
                />*/}
                <Environment preset="sunset" />
                <ambientLight intensity={0.8} color="pink" />
                {/*<Background></Background>*/}
                {/*<Avatar_Realista position={[0,-1,3.5]} scale={0.44} rotation-y={degToRad(0)}/>*/}
                {<Claro_modelo position={[0,0,0]} scale={2} rotation-y={degToRad(0)} items={items}/>}
                {/*<Avatar 
                    avatar={"avatar_realista_prueba"}
                    position={[-1.2,-1,3.5]}
                    scale={1}
                    rotation-y={degToRad(7)}
                />
                <Avatar/>*/}
                {/*<Gltf src = "/models/Claro_modelo.glb" position={[-0.5,0,0]}/>*/}
                 
                
            </Canvas>
        </>
    );
};

const CAMERA_POSITIONS = {
    default: [0,60,150],
    conversation: [-2.9601898730596594, 9.366746889166946e-15, 152.94194086618435]
};

const CAMERA_ZOOMS = {
    default: 1,
    conversation: 2.65,
};


//position={[-0.5,0,0]}, 0.5 a la izquierda, 0 en y y 0 en cercania a la camara
const CameraManager = ({items}) => {
    const controls = useRef();
    useControls("Helper", {
        getCameraPosition: button(() => {
            const position = controls.current.getPosition();
            const zoom = controls.current.camera.zoom;
            console.log([...position], zoom);
        }),
    });
    useEffect(() => {
        if (items.length > 0){
            controls.current?.setPosition(...CAMERA_POSITIONS.conversation,true);
            controls.current?.zoomTo(CAMERA_ZOOMS.conversation,true);
        }
    }, [items]);
    return (
    <CameraControls 
        ref={controls}
        minZoom={1}
        maxZoom={5}
        polarRotateSpeed ={-0.3} //reversando para tener un efecto mas 
        azimuthRotateSpeed ={-0.3} //reversando para tener un efecto mas natural
        minPolarAngle={degToRad(90)} // no hay movimiento vertical
        maxPolarAngle={degToRad(50)} // no hay movimiento vertical
        minAzimuthAngle={degToRad(-30)} // limit how far left (negative value in degrees)
        maxAzimuthAngle={degToRad(30)} // limit how far right (positive value in degrees)
            
        mouseButtons={{
            left: 1, //ACTION.ROTATE
            wheel: 16, //ACTION.ZOOM
        }}
        touches={{
            one:32, //ACTION.TOUCH_ROTATE
            two:512, //ACTION.TOUCH_ZOOM
        }}

    
    />
    );
};