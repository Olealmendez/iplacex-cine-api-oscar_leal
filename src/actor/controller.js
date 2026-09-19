import { ObjectId } from 'mongodb'
import client from '../common/db.js'
import { Actor } from './actor.js'

const actorCollection = client.db('cine-db').collection('actores')
const peliculaCollection = client.db('cine-db').collection('peliculas')

async function handleInsertActorRequest(req, res) {
    let data = req.body
    let actor = Actor

    actor.idPelicula = data.idPelicula
    actor.nombre = data.nombre
    actor.edad = data.edad
    actor.estaRetirado = data.estaRetirado
    actor.premios = data.premios

    try {
        let oidPelicula = ObjectId.createFromHexString(actor.idPelicula)
        let peliculaExistente = await peliculaCollection.findOne({ _id: oidPelicula })

        if (!peliculaExistente) {
            return res.status(404).send('La película no existe')
        }

        await actorCollection.insertOne(actor)
        .then((data) => {
            if (data === null) return res.status(400).send('Error al guardar registro')
            return res.status(201).send(data)
        })
        .catch((e) => { return res.status(500).send({ error: e }) })
    } catch (e) {
        return res.status(400).send('Id de película mal formado')
    }
}

async function handleGetActoresRequest(req, res) {
    await actorCollection.find({}).toArray()
    .then((data) => { return res.status(200).send(data) })
    .catch((e) => { return res.status(500).send({ error: e }) })
}

async function handleGetActorByIdRequest(req, res) {
    let id = req.params.id

    try {
        let oid = ObjectId.createFromHexString(id)

        await actorCollection.findOne({ _id: oid })
        .then((data) => {
            if (data === null) return res.status(404).send(data)
            return res.status(200).send(data)
        })
        .catch((e) => { return res.status(500).send({ error: e.code }) })
    } catch (e) {
        return res.status(400).send('Id mal formado')
    }
}

async function handleGetActoresByPeliculaIdRequest(req, res) {
    let idPelicula = req.params.pelicula

    try {
        let oidPelicula = ObjectId.createFromHexString(idPelicula)

        await actorCollection.find({ idPelicula: oidPelicula.toString() }).toArray()
        .then((data) => {
            if (data === null) return res.status(404).send(data)
            return res.status(200).send(data)
        })
        .catch((e) => { return res.status(500).send({ error: e.code }) })
    } catch (e) {
        return res.status(400).send('Id de película mal formado')
    }
}

export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
}