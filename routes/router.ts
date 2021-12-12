import { Router, Request, Response } from 'express';
import Server from '../classes/server';
// import { Socket } from 'socket.io';
import { usuariosConectados } from '../sockets/socket';

const router = Router();

router.get('/mensajes', ( req: Request, res: Response ) => {
    res.json({
        ok: true,
        mensaje: 'Todo esta bien!!!'
    });
});

router.post('/mensajes', ( req: Request, res: Response ) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const paylaod = { de, cuerpo };

    const server = Server.instance;
    server.io.emit('mensaje-nuevo', paylaod );

    res.json({
        ok: true,
        cuerpo,
        de,
    });
});

router.post('/mensajes/:id', ( req: Request, res: Response ) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;
    const payload = {
        de,
        cuerpo,
    }

    const server = Server.instance;

    // Envió de mensaje a todos los usuarios
    // server.io.emit('mensaje-privado', payload );

    // Envió de mensaje a un solo usuario
    server.io.in( id ).emit('mensaje-privado', payload );
    
    res.json({
        ok: true,
        cuerpo,
        de,
        id,
    });
});

// Servicio para obtener todos los IDs de los usuarios (este código es diferente)
router.get('/usuarios', (req: Request, res: Response) => {
    const server = Server.instance;
    server.io .allSockets().then( (clientes) => {
            res.json({
                ok: true,
                clientes : Array.from(clientes)
        });    
    })
    .catch( err =>{
        res.json({
            ok: false,
            err,
        });
    })
});

// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', (req: Request, res: Response) => {
    res.json({
        ok: true,
        clientes : usuariosConectados.getLista();
    });  
});


export default router;