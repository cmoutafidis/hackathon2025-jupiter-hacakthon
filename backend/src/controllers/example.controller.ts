import { Request, Response, NextFunction } from 'express';

class ExampleController {
  /**
   * Get all examples
   * @route GET /api/examples
   */
  public getExamples = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // In a real application, this would fetch from a database
      const examples = [
        { id: 1, name: 'Example 1' },
        { id: 2, name: 'Example 2' },
      ];
      
      res.status(200).json({
        success: true,
        data: examples,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get example by ID
   * @route GET /api/examples/:id
   */
  public getExampleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      // In a real application, this would fetch from a database
      const example = { id: Number(id), name: `Example ${id}` };
      
      if (!example) {
        res.status(404).json({
          success: false,
          message: 'Example not found',
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: example,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new ExampleController();
