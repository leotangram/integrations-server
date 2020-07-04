const Task = require('../models/Task')
const Project = require('../models/Project')
const { validationResult } = require('express-validator')

exports.createTask = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  try {
    const { project } = req.body
    const projectExist = await Project.findById(project)
    if (!projectExist)
      return res.status(404).json({ message: 'Proyecto no encontrado' })
    if (projectExist.creator.toString() !== req.user.id)
      return res.status(401).json({ message: 'No autorizado' })
    const task = new Task(req.body)
    await task.save()
    res.json({ task })
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}

exports.getTasks = async (req, res) => {
  try {
    const { project } = req.query
    const projectExist = await Project.findById(project)
    if (!projectExist)
      return res.status(404).json({ message: 'Proyecto no encontrado' })
    if (projectExist.creator.toString() !== req.user.id)
      return res.status(401).json({ message: 'No autorizado' })
    const tasks = await Task.find({ project }).sort({ created: -1 })
    res.json({ tasks })
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}

exports.updateTask = async (req, res) => {
  try {
    const { project, name, state } = req.body
    let task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ message: 'No existe esa tarea' })
    const projectExist = await Project.findById(project)
    if (projectExist.creator.toString() !== req.user.id)
      return res.status(401).json({ message: 'No autorizado' })
    const newTask = {}
    newTask.name = name
    newTask.state = state
    task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, {
      new: true
    })
    res.json({ task })
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}

exports.deleteTask = async (req, res) => {
  try {
    const { project } = req.query
    let task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ message: 'No existe esa tarea' })
    const projectExist = await Project.findById(project)
    if (projectExist.creator.toString() !== req.user.id)
      return res.status(401).json({ message: 'No autorizado' })
    await Task.findOneAndRemove({ _id: req.params.id })
    res.json({ message: 'Tarea eliminada' })
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}
