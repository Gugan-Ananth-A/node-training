import * as bcrypt from 'bcrypt';
import { User } from '../models/user.entities';
import { Request, Response } from 'express';
import AppDataSource from '../config/database'

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.name = name;
    user.email = email;
    user.hash = hashedPassword;
    user.role = role;

    const userRepository = AppDataSource.getRepository(User);
    const savedUser = await userRepository.save(user);
    res.status(201).json({id: savedUser.id, name: savedUser.name, email: savedUser.email, role: savedUser.role });
  } catch (err){
    res.status(500).json({ message: err });
  }
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
 try{
    const userRepository = AppDataSource.getRepository(User);
    const user: User | null = await userRepository.findOneBy({ id: parseInt(req.params.id)});
    if (user){
        res.status(201).json({name: user.name, email: user.email, role: user.role});
    } else {
        res.status(404).json({ message: 'User not found'});
    }
 }catch (err){
    res.status(500).json({message: err});
 }
}

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try{
       const userRepository = AppDataSource.getRepository(User);
       const users: User[] | null = await userRepository.find();
       if (users){
           const properUsers = users.map((user) => {return {id: user.id, name: user.name, email: user.email, role: user.role}});
           res.status(201).json({properUsers});
       } else {
           res.status(404).json({ message: 'User not found'});
       }
    }catch (err){
       res.status(500).json({message: err});
    }
   }

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try{
        const userRepository = AppDataSource.getRepository(User);
        const user: User | null = await userRepository.findOneBy({ id: parseInt(req.params.id)});
        if(user){
            userRepository.merge(user, req.body);
            const updateUser = await userRepository.save(user);
            res.status(201).json({name: updateUser.name, email: updateUser.email, role: updateUser.role});
        }else{
            res.status(404).json({message: 'User not found'});
        }
    }catch (err){
        res.status(500).json({message: err});
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try{
        const userRepository = AppDataSource.getRepository(User);
        const result = await userRepository.delete(req.params.id);
        if(result.affected){
            res.status(201).json({ message: 'User Deleted'});
        }else{
            res.status(404).json({ message: 'User not found'});
        }
    }catch(err){
        res.status(500).json({message: err});
    }
}
