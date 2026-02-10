import Phaser from 'phaser';

// Typed event bus for React ↔ Phaser communication
const EventBus = new Phaser.Events.EventEmitter();

export default EventBus;
