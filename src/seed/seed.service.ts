import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Node,
  NodePropertyKey,
  NodePropertyValue,
  NodeType,
  Relationship,
  RelationshipPropertyKey,
  RelationshipPropertyValue,
  RelationshipType,
} from '../model/entities';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Node)
    private readonly nodeRepo: Repository<Node>,
    @InjectRepository(NodeType)
    private readonly nodeTypeRepo: Repository<NodeType>,
    @InjectRepository(NodePropertyKey)
    private readonly nodePropertyKeysRepo: Repository<NodePropertyKey>,
    @InjectRepository(NodePropertyValue)
    private readonly nodePropertyValuesRepo: Repository<NodePropertyValue>,

    @InjectRepository(Relationship)
    private readonly relationshipRepo: Repository<Relationship>,
    @InjectRepository(RelationshipType)
    private readonly relationshipTypeRepo: Repository<RelationshipType>,
    @InjectRepository(RelationshipPropertyKey)
    private readonly relationshipPropertyKeyRepo: Repository<RelationshipPropertyKey>,
    @InjectRepository(RelationshipPropertyValue)
    private readonly relationshipPropertyValuesRepo: Repository<RelationshipPropertyValue>,
  ) {}

  async makeGraphEntities() {
    const nodeType1 = this.nodeTypeRepo.create({
      type_name: Math.random().toString(36).substring(2, 10),
    });
    const nodeType2 = this.nodeTypeRepo.create({
      type_name: Math.random().toString(36).substring(2, 10),
    });
    const node1 = this.nodeRepo.create({
      nodeType: nodeType1,
    });
    const node2 = this.nodeRepo.create({
      nodeType: nodeType2,
    });

    const relationshipType = this.relationshipTypeRepo.create({
      type_name: Math.random().toString(36).substring(2, 10),
    });

    const relationship = this.relationshipRepo.create({
      relationshipType,
      fromNode: node1,
      toNode: node2,
    });

    const nodePropKey = this.nodePropertyKeysRepo.create({
      property_key: 'some_key' + Math.random().toString(36).substring(2, 10),
      node: node1,
    });

    const nodePropValue = this.nodePropertyValuesRepo.create({
      propertyKey: nodePropKey,
      property_value: JSON.stringify({
        value:
          'some_node_prop_value' + Math.random().toString(36).substring(2, 10),
      }),
    });

    const relPropKey = this.relationshipPropertyKeyRepo.create({
      property_key: Math.random().toString(36).substring(2, 10),
      relationship: relationship,
    });

    const relPropValue = this.relationshipPropertyValuesRepo.create({
      propertyKey: relPropKey,
      property_value: JSON.stringify({
        value:
          'some_rel_prop_value' + Math.random().toString(36).substring(2, 10),
      }),
    });

    await this.nodeTypeRepo.save(nodeType1);
    await this.nodeTypeRepo.save(nodeType2);
    await this.nodeRepo.save(node1);
    await this.nodeRepo.save(node2);
    await this.relationshipTypeRepo.save(relationshipType);
    await this.relationshipRepo.save(relationship);
    await this.nodePropertyKeysRepo.save(nodePropKey);
    await this.nodePropertyValuesRepo.save(nodePropValue);
    await this.relationshipPropertyKeyRepo.save(relPropKey);
    await this.relationshipPropertyValuesRepo.save(relPropValue);
  }
}
