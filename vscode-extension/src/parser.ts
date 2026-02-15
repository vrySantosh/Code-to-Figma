import { ComponentSchema, ComponentNode, StyleData } from './types';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';

export class ComponentParser {
    
    async parseToSchema(code: string, languageId: string): Promise<ComponentSchema> {
        if (languageId === 'typescriptreact' || languageId === 'javascriptreact' || languageId === 'typescript' || languageId === 'javascript') {
            return this.parseReactComponent(code);
        } else if (languageId === 'html') {
            return this.parseHTMLComponent(code);
        } else if (languageId === 'vue') {
            return this.parseVueComponent(code);
        } else {
            throw new Error(`Unsupported language: ${languageId}`);
        }
    }

    private parseReactComponent(code: string): ComponentSchema {
        try {
            const ast = parser.parse(code, {
                sourceType: 'module',
                plugins: ['jsx', 'typescript']
            });

            let rootComponent: ComponentNode | null = null;
            let componentName = 'Component';

            traverse(ast, {
                JSXElement: (path: any) => {
                    if (!rootComponent) {
                        rootComponent = this.parseJSXElement(path.node);
                    }
                },
                FunctionDeclaration: (path: any) => {
                    if (path.node.id?.name) {
                        componentName = path.node.id.name;
                    }
                },
                VariableDeclarator: (path: any) => {
                    if (path.node.id?.name && path.node.init?.type === 'ArrowFunctionExpression') {
                        componentName = path.node.id.name;
                    }
                }
            });

            if (!rootComponent) {
                throw new Error('No JSX component found');
            }

            // Set component name if not already set
            const component = rootComponent as ComponentNode;
            if (!component.name) {
                component.name = componentName;
            }

            return {
                component: component,
                metadata: {
                    framework: 'React Native',
                    exportedAt: new Date().toISOString()
                }
            };
        } catch (error) {
            throw new Error(`Failed to parse React component: ${error}`);
        }
    }

    private parseJSXElement(node: any): ComponentNode {
        const componentNode: ComponentNode = {
            type: this.getComponentType(node.openingElement.name),
            children: []
        };

        // Parse attributes/props
        const styles: StyleData = {};
        const props: Record<string, any> = {};

        node.openingElement.attributes?.forEach((attr: any) => {
            if (attr.type === 'JSXAttribute') {
                const name = attr.name.name;
                const value = this.getAttributeValue(attr.value);

                if (name === 'style') {
                    Object.assign(styles, value);
                } else {
                    props[name] = value;
                }
            }
        });

        if (Object.keys(styles).length > 0) {
            componentNode.styles = styles;
        }
        if (Object.keys(props).length > 0) {
            componentNode.props = props;
        }

        // Parse children
        node.children?.forEach((child: any) => {
            if (child.type === 'JSXElement') {
                componentNode.children?.push(this.parseJSXElement(child));
            } else if (child.type === 'JSXText' && child.value.trim()) {
                componentNode.text = child.value.trim();
            } else if (child.type === 'JSXExpressionContainer' && child.expression.type === 'StringLiteral') {
                componentNode.text = child.expression.value;
            }
        });

        return componentNode;
    }

    private getComponentType(nameNode: any): any {
        if (nameNode.type === 'JSXIdentifier') {
            return nameNode.name;
        }
        if (nameNode.type === 'JSXMemberExpression') {
            return `${nameNode.object.name}.${nameNode.property.name}`;
        }
        return 'View';
    }

    private getAttributeValue(valueNode: any): any {
        if (!valueNode) {
            return true;
        }
        if (valueNode.type === 'StringLiteral') {
            return valueNode.value;
        }
        if (valueNode.type === 'JSXExpressionContainer') {
            return this.evaluateExpression(valueNode.expression);
        }
        return null;
    }

    private evaluateExpression(expression: any): any {
        if (expression.type === 'NumericLiteral') {
            return expression.value;
        }
        if (expression.type === 'StringLiteral') {
            return expression.value;
        }
        if (expression.type === 'BooleanLiteral') {
            return expression.value;
        }
        if (expression.type === 'ObjectExpression') {
            const obj: Record<string, any> = {};
            expression.properties?.forEach((prop: any) => {
                if (prop.type === 'ObjectProperty') {
                    const key = prop.key.name || prop.key.value;
                    obj[key] = this.evaluateExpression(prop.value);
                }
            });
            return obj;
        }
        if (expression.type === 'ArrayExpression') {
            return expression.elements?.map((el: any) => this.evaluateExpression(el)) || [];
        }
        return null;
    }

    private parseHTMLComponent(code: string): ComponentSchema {
        // Simple HTML parser - can be enhanced with a proper HTML parser library
        const tempDiv = { innerHTML: code } as any;
        const rootElement = this.parseHTMLElement(code);

        return {
            component: rootElement,
            metadata: {
                framework: 'HTML',
                exportedAt: new Date().toISOString()
            }
        };
    }

    private parseHTMLElement(html: string): ComponentNode {
        // Basic HTML parsing - this is simplified
        // In production, you'd use a proper HTML parser
        const tagMatch = html.match(/<(\w+)([^>]*)>(.*?)<\/\1>/s);
        
        if (!tagMatch) {
            return { type: 'div', text: html.trim() };
        }

        const [, tagName, attributes, content] = tagMatch;
        const component: ComponentNode = {
            type: tagName as any,
            children: []
        };

        // Parse inline styles
        const styleMatch = attributes.match(/style=["']([^"']+)["']/);
        if (styleMatch) {
            component.styles = this.parseInlineStyles(styleMatch[1]);
        }

        // Parse text content or children
        if (content.includes('<')) {
            // Has child elements - recursively parse
            const childMatch = content.match(/<\w+/g);
            if (childMatch) {
                component.children?.push(this.parseHTMLElement(content));
            }
        } else {
            component.text = content.trim();
        }

        return component;
    }

    private parseInlineStyles(styleString: string): StyleData {
        const styles: StyleData = {};
        const declarations = styleString.split(';');

        declarations.forEach(decl => {
            const [property, value] = decl.split(':').map(s => s.trim());
            if (property && value) {
                const camelCaseProperty = property.replace(/-([a-z])/g, g => g[1].toUpperCase());
                (styles as any)[camelCaseProperty] = this.parseStyleValue(value);
            }
        });

        return styles;
    }

    private parseStyleValue(value: string): any {
        // Remove 'px' and convert to number if applicable
        if (value.endsWith('px')) {
            return parseFloat(value);
        }
        // Check if it's a number
        if (!isNaN(Number(value))) {
            return Number(value);
        }
        return value;
    }

    private parseVueComponent(code: string): ComponentSchema {
        // Extract template section
        const templateMatch = code.match(/<template>(.*?)<\/template>/s);
        if (!templateMatch) {
            throw new Error('No template found in Vue component');
        }

        const templateHTML = templateMatch[1].trim();
        return this.parseHTMLComponent(templateHTML);
    }
}
