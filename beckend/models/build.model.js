const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890', 8);

const buildSchema = new mongoose.Schema({
    buildName: {
        type: String,
        required: true,
        trim: true
    },
    uid: {
        type: Number,
        required: true,
        unique: true,
        default: () => nanoid()
    },

    components: {
        cpu: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        motherboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        cooler: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        ram: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        gpu: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        storage: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        psu: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        pcCase: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' }
    }
}, {
    timestamps: true
});

const Build = mongoose.model('Build', buildSchema);

module.exports = Build;