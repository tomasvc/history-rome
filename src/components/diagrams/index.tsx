import type { ComponentType } from 'react';
import { AugustusPowers, Cannae, CenturiateAssembly, CursusHonorum, HopkinsModel, MixedConstitution } from './republic';
import { Aqueduct, Domus, Legion, Legitimacy, ProvincialGovernment, TaxesTrade } from './empire';
import { ChristianGrowth, ClimateTimeline, Debasement, LateAdministration, Tetrarchy, TheodosianWalls, WestCauses } from './late';
import './diagrams.css';

/** Registry of teaching diagrams used by the :::diagram directive. Keys are checked by scripts/validate-content.ts. */
const REGISTRY: Record<string, ComponentType> = {
  'cursus-honorum': CursusHonorum,
  'centuriate-assembly': CenturiateAssembly,
  'mixed-constitution': MixedConstitution,
  'cannae': Cannae,
  'hopkins-model': HopkinsModel,
  'augustus-powers': AugustusPowers,
  'legion': Legion,
  'provincial-government': ProvincialGovernment,
  'taxes-trade': TaxesTrade,
  'legitimacy': Legitimacy,
  'domus': Domus,
  'aqueduct': Aqueduct,
  'debasement': Debasement,
  'tetrarchy': Tetrarchy,
  'late-administration': LateAdministration,
  'christian-growth': ChristianGrowth,
  'west-causes': WestCauses,
  'theodosian-walls': TheodosianWalls,
  'climate-timeline': ClimateTimeline,
};

export const diagramIds = Object.keys(REGISTRY);

export function Diagram({ id }: { id: string }) {
  const C = REGISTRY[id];
  if (!C) return <p className="missing">Diagram “{id}” not found.</p>;
  return <C />;
}
