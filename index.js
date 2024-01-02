const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const multer = require('multer')
const path = require('path')
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 3001;

app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'att-uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

// SingnUp
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                profileImage: 'default-profile.png'
            },
        });

        res.json({ userId: newUser.userId, username: newUser.username });
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: {
                username,
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ userId: user.userId, username: user.username });
    } catch (error) {
        console.error('Error handling login:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Pegar o usuario pelo ID
app.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Busque o usuário no banco de dados pelo ID
        const user = await prisma.user.findUnique({
            where: { userId: parseInt(userId, 10) },
            include: { notes: true }, // Inclua as notas relacionadas ao usuário se necessário
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Anexar arquivo á nota
app.post('/note/:noteId/attachment', upload.single('attachment'), async (req, res) => {
    const { noteId } = req.params
    const { filename } = req.file

    try {
        const note = await prisma.note.findUnique({
            where: { noteId: parseInt(noteId, 10) }
        })

        if (!note) {
            return res.status(404).json({ error: 'Note not Found' })
        }

        const updateNote = await prisma.note.update({
            where: { noteId: parseInt(noteId, 10) },
            data: {
                attachment: filename,
            }
        })

        res.json(updateNote)
    } catch (error) {
        console.error('Erro ao fazer o attachement: ', error)
        res.status(500).json({ error: 'Internal server Erro' })
    }
})

// Listar Notas por user ID
app.get('/user/:userId/notes', async (req, res) => {

    const { userId } = req.params

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

// Editar nota
app.put('/notes/:noteId/edit', async (req, res) => {
    const { noteId } = req.params
    const { title, content, createdDate } = req.body

    try {
        const updatedNote = await prisma.note.update({
            where: { noteId: parseInt(noteId, 10) },
            data: {
                title,
                content,
                createdDate
            }
        })

        res.json(updatedNote)
    } catch (error) {
        console.error('Error updating note', error),
            res.status(500).json({ error: 'Internal server error' })
    }

})

// Deletar Nota
app.delete('/notes/:noteId/delete', async (req, res) => {
    const { noteId } = req.params

    try {
        await prisma.note.delete({
            where: { noteId: parseInt(noteId, 10) }
        })
        res.json({ message: 'Nota excluída!' })
    } catch (error) {
        console.error('Error deleting note', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
