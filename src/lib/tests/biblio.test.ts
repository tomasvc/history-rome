import { describe, expect, it } from 'vitest';
import { addsToTitle } from '../cite';

describe('reading notes', () => {
  it('drops notes that only repeat the title', () => {
    expect(addsToTitle('Hadrian: The Restless Emperor.', 'Hadrian: The Restless Emperor')).toBe(false);
    expect(addsToTitle('Vespasian.', 'Vespasian')).toBe(false);
    expect(addsToTitle('The Fate of Rome: Climate, Disease and the End of an Empire.', 'The Fate of Rome: Climate, Disease, and the End of an Empire')).toBe(false);
  });
  it('keeps notes that say why to read the work', () => {
    expect(addsToTitle("Nero's self-presentation and popular memory.", 'Nero')).toBe(true);
    expect(addsToTitle('Chapter 1, "Conquerors and Slaves", sets out the model.', 'Conquerors and Slaves')).toBe(true);
  });
});
