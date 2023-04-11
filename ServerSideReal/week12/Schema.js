const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    team: { type: Array, required: false },
    sprints: { type: Array, required: false },
    userStories: { type: Array, required: false }
  });
  
  const Project = mongoose.model('Project', projectSchema);
  
  export { Project };
  