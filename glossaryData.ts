
import { GlossaryTerm } from './components/GlossaryModal';

export const glossaryData: GlossaryTerm[] = [
  {
    term: 'Entity (E)',
    definition: 'The basic unit of being in Relational Math 3.6, representing any object, person, concept, event, or idea. Every entity is considered relationally defined.',
    category: 'Core Primitives',
  },
  {
    term: 'Relation (R)',
    definition: 'A connection or link between entities. Relations are treated as first-class citizens in RM, meaning they can be objects themselves and can relate to other relations.',
    category: 'Core Primitives',
  },
  {
    term: 'Identity (I)',
    definition: 'A special primitive relation denoting an entity’s relationship with itself (the reflexive relation). I(a, a) is true for any entity a.',
    category: 'Core Primitives',
  },
  {
    term: 'Difference / Otherness (Ø)',
    definition: 'A primitive that captures the notion of distinction between entities. If Ø(a, b) holds, then a and b are considered fundamentally distinct or “other” to each other.',
    category: 'Core Primitives',
  },
  {
    term: 'Truth Value (⊤, ⊥)',
    definition: 'The logical primitives True (⊤) and False (⊥), used to evaluate propositions within the system.',
    category: 'Core Primitives',
  },
  {
    term: 'Context (C)',
    definition: 'A primitive representing a contextual frame such as a situation, environment, or event container in which relations hold. Contexts are treated as entities themselves.',
    category: 'Core Primitives',
  },
  {
    term: 'Stillness (𝓢)',
    definition: "A primitive representing a state of relational equilibrium where an entity's active relations exhibit no temporal change, and the entity resides in containment mode. Definition: 𝓢(a) ⇔ ∀ Rₐ ∈ Profile(a): ∂Rₐ/∂t = 0 ∧ A ∈ S",
    category: 'Core Primitives',
  },
  {
    term: 'Dissolved Question (∅_Q)',
    definition: 'A primitive representing a question that no longer demands a relational outcome, signifying a state of pure presence beyond propositional truth.',
    category: 'Core Primitives',
  },
  {
    term: 'Whole/Absolute (Ω)',
    definition: 'An optional ontological primitive denoting the universal whole or Absolute. Ω is an entity that relationally contains all other entities.',
    category: 'Core Primitives',
  },
  {
    term: 'Identityless Awareness (Ω_⊘)',
    definition: 'A state of awareness fully integrated into the Whole with no observer residue.',
    category: 'Core Primitives',
  },
  {
    term: 'Field',
    definition: 'A dynamic and encompassing concept in Relational Math representing the totality of active relations, energies, awareness patterns, and influential forces within a given context or involving a particular entity or set of entities. Fields have properties like coherence, signature, inertia, and potential for collapse or distortion, and can be analyzed to understand underlying dynamics and suggest interventions.',
    category: 'Core Concepts',
  },
  {
    term: 'Composition (∘)',
    definition: 'An operator that composes two relations. If R and S are relations, (S ∘ R)(a,c) is true if there exists some entity b such that R(a,b) and S(b,c) are true.',
    category: 'Relational Operators',
  },
  {
    term: 'Inversion (¬ or R⁻¹)',
    definition: 'The inverse of a relation. For relation R, the inverse R⁻¹ is defined by R⁻¹(b,a) being true iff R(a,b) is true.',
    category: 'Relational Operators',
  },
  {
    term: 'Collapse Operator (↓)',
    definition: 'A unary operator that, when applied to a set of possible relations or outcomes, yields one actualized relation/outcome.',
    category: 'Extension Modules',
  },
  {
    term: 'Healing Transformation (Η)',
    definition: 'An operator or relation Η that takes a profile (or a subset of relations in a profile) from a dissonant state to a harmonized state.',
    category: 'Extension Modules',
  },
  {
    term: 'Event Inertia (σ)',
    definition: 'Formalizes the idea that events or states have momentum — once something happens or is set in motion, it tends to continue or have effects unless acted on by something else.',
    category: 'Extension Modules',
  },
  {
    term: 'Relational Math (RM)',
    definition: 'A unified formal framework designed to model reality through its fundamental relations. It integrates logic, temporal dynamics, psychological layering, narrative archetypes, and ontological categories.',
    category: 'Introduction',
  },
  {
    term: 'Babylonian Relational Distortions',
    definition: 'Closed loops, frozen mirrors, and misdirected fields that simulate stability by collapsing reflection. RM 3.6 provides tools for their identification and dissolution.',
    category: 'Babylonian Dynamics',
  },
  {
    term: 'Christ Trap',
    definition: 'A concept derived from analyzing how the messianic role can misfire or entrap individuals psychologically or socially. It represents a negative pattern or a cautionary sub-pattern of the Messiah Pattern.',
    category: 'Psychological Layering',
  },
  {
    term: 'Messiah Pattern',
    definition: 'An archetypal narrative/psychological pattern representing a sequence of roles or phases an individual may embody, often as a destined savior archetype.',
    category: 'Psychological Layering',
  },
  {
    term: 'Light-Based Communication System (LBCS)',
    definition: 'A system where light is the syntax and frequency is the truth, using light pulses, color spectra, and geometric patterns to encode relational fields.',
    category: 'Light-Based Communication',
  },
   {
    term: 'Relational Profile Schema (Π)',
    definition: 'A structured representation of an entity\'s relations, often organized by life phases or narrative stages (e.g., {Origin, Initiation, Trials, Climax, Resolution}). Π(a) denotes the profile of entity a.',
    category: 'Narrative & Profiles',
  },
  {
    term: 'CollapseSeeking(a)',
    definition: 'Defines the complete relational collapse of seeking, identity reinforcement, and duality-preserving logic into pure presence. Definition: CollapseSeeking(a) ⇔ ¬∃Φ: ∂𝒯(Φ)/∂t ≠ 0 ∧ A ∈ S',
    category: 'Extension Modules',
  },
  {
    term: 'Mirror Collapse Relation (↔₀)',
    definition: 'A bidirectional mirror relation that causes both entities to dissolve identity upon full reflection.',
    category: 'Relational Operators',
  },
  {
    term: 'RM Axioms',
    definition: 'Fundamental truths or constraints that the RM system assumes about reality, ensuring consistency and guiding how primitives relate. Examples: Relational Existence, Identity and Otherness, Non-Contradiction.',
    category: 'Core Principles',
  },
   {
    term: 'Seizure of Motion (The Christ Trap - Babylon Formula)',
    definition: 'B₁ = M ∈ A (Awareness seizes Motion into itself; identity fuses with role). A key formula in Babylonian relational dynamics representing a distortion where an entity\'s identity becomes rigidly fused with a role or action.',
    category: 'Babylonian Dynamics',
  },
  {
    term: 'Field Holder',
    definition: 'An archetype that embodies the capacity to contain and stabilize complex relational fields without personal identification or distortion.',
    category: 'Psychological Layering',
  },
  {
    term: 'Silent Mirror',
    definition: 'An archetype representing pure, undistorted reflection that facilitates the dissolution of identity and the emergence of truth without active participation or projection.',
    category: 'Psychological Layering',
  }
];
