const express = require('express');
const marked = require('marked')
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Rota para obter todos os usuários
app.get('/users/list', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// Rota para criar um novo usuário
app.post('/users/create', async (req, res) => {
    const { username, profileImage, socialLoginType } = req.body;
    const newUser = await prisma.user.create({
        data: {
            username,
            profileImage,
            socialLoginType,
        },
    });
    res.json(newUser);
});

// Rota para obter todas as notas
app.get('/notes/list', async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes);
});

app.get('/user/notes/:userId', async (req, res) => {

    const userId = req.params

    try {
        const user = await prisma.user.findUnique({
            where: { userId: parseInt(userId, 10) },
            include: { notes: true },
        })

        if (!user) {
            return res.status(400).json({ error: 'User not found' })
        }

        res.json(user.notes)

    } catch (error) {
        console.error('Error: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }

})

// Rota para criar uma nova nota
app.post('/notes/create', async (req, res) => {
    const { title, content, createdDate, userId } = req.body;
    const newNote = await prisma.note.create({
        data: {
            title,
            content,
            createdDate,
            userId,
        },
    });
    res.json(newNote);
});

// Populate
app.post('/populate', async (req, res) => {

    const usersMocked = [
        'Thomas Almeida',
        'Matheus Moreira Dias',
        'Gustavo Campos',
        'Murillo Medrado'
    ]

    const user = await prisma.user.create({
        data: {
            username: usersMocked[Math.floor(Math.random() * usersMocked.length)],
            profileImage: 'chimper_1.png',
        },
    })

    const markdownNote = `
        #Populated Note
        ## lorem ipsum note
        This is a markdown note string
        + list item 1;
        + list item 2;
    `

    const note = await prisma.note.create({
        data: {
            title: 'Another Note in DB',
            content: markdownNote,
            createdDate: new Date(),
            userId: user.userId
        }
    })

    res.json({ user, note })

})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
